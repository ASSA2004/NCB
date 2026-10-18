
import { createClient } from '@supabase/supabase-js';
import { projects } from '../lib/projects-data';
import fs from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        if (line.trim().startsWith('#')) return;
        const index = line.indexOf('=');
        if (index !== -1) {
            const key = line.substring(0, index).trim();
            let value = line.substring(index + 1).trim();
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            if (!process.env[key]) {
                process.env[key] = value;
            }
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
    console.log(`Starting seed of ${projects.length} projects...`);
    let successCount = 0;
    let errorCount = 0;

    for (const project of projects) {
        const { id, ...rest } = project;
        // Map project fields to DB schema

        const dbProject = {
            slug: id,
            title: project.title,
            title_ta: project.title_ta,
            location: project.location,
            location_ta: project.location_ta,
            total_area: project.total_area,
            total_area_ta: project.total_area_ta,
            ground_floor: project.ground_floor,
            ground_floor_ta: project.ground_floor_ta,
            first_floor: project.first_floor,
            first_floor_ta: project.first_floor_ta,
            highlights: project.highlights || null,
            highlights_ta: project.highlights_ta || null,
            thumbnail: project.thumbnail,
            featured: project.featured,
            completion_date: project.completionDate,
            status: project.status,
            gallery: project.gallery || [],
            updated_at: new Date().toISOString()
        };

        const { error } = await supabase
            .from('project_s1')
            .upsert(dbProject, { onConflict: 'slug' });

        if (error) {
            console.error(`Error upserting project ${project.title}:`, error.message);
            errorCount++;
        } else {
            console.log(`Successfully seeded: ${project.title}`);
            successCount++;
        }
    }

    console.log(`Seed complete. Success: ${successCount}, Errors: ${errorCount}`);
}

seed().catch(err => console.error('Unexpected error:', err));
