import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/assets/reference');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const srcImage = path.resolve('public/assets/aistudio/image_875cc00f.png');

// Crop regions: [name, width, height, x, y]
const crops = [
  // Full hero artwork or right half
  ['hero_full_banner.png', 985, 395, 207, 57],
  ['hero_jinwoo_beru.png', 560, 395, 630, 57],
  
  // Sidebar pagoda & sakura background
  ['sidebar_pagoda_sakura.png', 190, 700, 0, 525],
  
  // Today's Updates row 5 cards
  ['today_solo_leveling.png', 188, 88, 222, 517],
  ['today_dandadan.png', 188, 88, 421, 517],
  ['today_bluelock.png', 188, 88, 621, 517],
  ['today_chainsawman.png', 188, 88, 821, 517],
  ['today_jujutsukaisen.png', 166, 88, 1020, 517],
  
  // Mascot in Search Anime box
  ['search_mascot_chibi.png', 115, 95, 525, 860],
  
  // Featured Anime card
  ['featured_jinwoo_sunset.png', 135, 230, 525, 980],
  ['featured_poster.png', 40, 48, 222, 1010],
  ['featured_micro_1.png', 38, 32, 222, 1065],
  ['featured_micro_2.png', 38, 32, 222, 1105],
  ['featured_micro_3.png', 38, 32, 222, 1145],
  
  // Popular this week thumbnails (40x40 approx)
  ['popular_1_solo.png', 38, 38, 715, 742],
  ['popular_2_onepiece.png', 38, 38, 715, 788],
  ['popular_3_jjk.png', 38, 38, 715, 834],
  ['popular_4_demonslayer.png', 38, 38, 715, 880],
  ['popular_5_chainsawman.png', 38, 38, 715, 926],
  
  // Latest episodes thumbnails
  ['episodes_1_solo.png', 38, 38, 725, 1000],
  ['episodes_2_bluelock.png', 38, 38, 725, 1046],
  ['episodes_3_dandadan.png', 38, 38, 725, 1092],
  ['episodes_4_jjk.png', 38, 38, 725, 1138],
  
  // Good Anime Good Vibes banner
  ['good_anime_vibes_banner.png', 215, 100, 976, 928],
  
  // Download & Watch Anywhere device banner
  ['download_device_mockup.png', 190, 80, 988, 1132],
  
  // Avatar circle in header
  ['header_avatar.png', 28, 28, 1155, 14],
];

console.log('Extracting crops from reference image...');
for (const [name, w, h, x, y] of crops) {
  const dest = path.join(outDir, name);
  const cmd = `convert "${srcImage}" -crop ${w}x${h}+${x}+${y} +repage "${dest}"`;
  try {
    execSync(cmd);
    console.log(`✓ Cropped ${name} (${w}x${h}+${x}+${y})`);
  } catch (err) {
    console.error(`✗ Error cropping ${name}:`, err.message);
  }
}
console.log('All crops completed!');
