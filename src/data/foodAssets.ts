// Image assets mapping for Uncle's Chinese Restaurant
import heroImg from '../assets/images/hero_uncles_chinese_spread_1790412044835.jpg';
import manchowSoupImg from '../assets/images/food_manchow_soup_1790412058706.jpg';
import paneerChillyImg from '../assets/images/food_paneer_chilly_1790412072740.jpg';
import schezwanNoodlesImg from '../assets/images/food_schezwan_noodles_1790412088668.jpg';
import chickenLollipopImg from '../assets/images/food_chicken_lollipop_1790412105196.jpg';

export const ASSET_IMAGES = {
  hero: heroImg,
  manchowSoup: manchowSoupImg,
  paneerChilly: paneerChillyImg,
  schezwanNoodles: schezwanNoodlesImg,
  chickenLollipop: chickenLollipopImg,
};

/**
 * Returns a high-fidelity image based on category and dish name.
 * Uses realistic generated images with category-tailored assignments.
 */
export function getFoodImage(category: string, name: string, diet: 'veg' | 'non-veg' | 'egg'): string {
  const lowerName = name.toLowerCase();

  // Specific item matching for hyper-realistic visual fidelity
  if (lowerName.includes('lollipop')) {
    return ASSET_IMAGES.chickenLollipop;
  }
  if (lowerName.includes('chilly') || lowerName.includes('paneer') || lowerName.includes('crispy') || lowerName.includes('65')) {
    return ASSET_IMAGES.paneerChilly;
  }
  if (category.toLowerCase().includes('soup')) {
    return ASSET_IMAGES.manchowSoup;
  }
  if (category.toLowerCase().includes('noodles') || lowerName.includes('noodles') || lowerName.includes('chopsuey')) {
    return ASSET_IMAGES.schezwanNoodles;
  }
  if (category.toLowerCase().includes('rice') || lowerName.includes('rice') || lowerName.includes('bhel')) {
    return ASSET_IMAGES.hero;
  }
  
  if (diet === 'non-veg') {
    return ASSET_IMAGES.chickenLollipop;
  }

  return ASSET_IMAGES.paneerChilly;
}
