// scripts/seed.mts
// Run: node scripts/seed.mts   (or: npx tsx scripts/seed.mts)
import "dotenv/config";
import { Pool } from "pg";
import _dummyData from "./src/utils/data"; // adjust path to your file
const dummyData = (_dummyData as any).default ?? _dummyData;

console.log("categories:", dummyData?.categories?.length); // should print 6

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function seed() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1) categories  → name→id map
    const catMap = new Map<string, string>();
    for (const c of dummyData.categories) {
      const { rows } = await client.query(
        `INSERT INTO category (name, description)
         VALUES ($1, $2)
         ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description
         RETURNING id`,
        [c.name, c.description],
      );
      catMap.set(c.name, rows[0].id);
    }

    // 2) customizations → name→id map
    const custMap = new Map<string, string>();
    for (const cu of dummyData.customizations) {
      const { rows } = await client.query(
        `INSERT INTO customization (name, price, type)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE SET price = EXCLUDED.price, type = EXCLUDED.type
         RETURNING id`,
        [cu.name, cu.price, cu.type],
      );
      custMap.set(cu.name, rows[0].id);
    }

    // 3) menu items + join rows
    for (const m of dummyData.menu) {
      const categoryId = catMap.get(m.category_name);
      if (!categoryId) throw new Error(`Unknown category: ${m.category_name}`);

      const { rows } = await client.query(
        `INSERT INTO menu_item
           (name, description, image_url, price, rating, calories, protein, category_id)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         RETURNING id`,
        [m.name, m.description, m.image_url, m.price, m.rating, m.calories, m.protein, categoryId],
      );
      const menuItemId = rows[0].id;

      for (const custName of m.customizations) {
        const customizationId = custMap.get(custName);
        if (!customizationId) throw new Error(`Unknown customization: ${custName}`);
        await client.query(
          `INSERT INTO menu_item_customization (menu_item_id, customization_id)
           VALUES ($1, $2) ON CONFLICT DO NOTHING`,
          [menuItemId, customizationId],
        );
      }
    }

    await client.query("COMMIT");
    console.log(
      `✓ seeded ${dummyData.categories.length} categories, ` +
        `${dummyData.customizations.length} customizations, ${dummyData.menu.length} menu items`,
    );
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Seed failed, rolled back:", e);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
