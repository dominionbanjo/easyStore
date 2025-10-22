
export const mockCategories = {
    fashion: [
        { name: "Paris'Men", thumbnail: "/videos/campaign2.mp4", seller: "Dominion", purchases: 15000 },
        { name: "Women's Fashion", thumbnail: "/images/fash0.png", seller: "Asuquo", purchases: 15000 },
        { name: "Women's Fashion", thumbnail: "/images/fash1.png", seller: "Asuquo", purchases: 15000 },
        { name: "Lacoste Fashion", thumbnail: "/videos/campaign1.mp4", seller: "Dominion", purchases: 15000 },
        { name: "Men's Fashion", thumbnail: "/images/fash2.png", seller: "Dominion", purchases: 15000 },
        { name: "Baddie's", thumbnail: "/images/fash3.png", seller: "Asuquo", purchases: 15000 },
        { name: "Corporate Ladies", thumbnail: "/images/fash4.png", seller: "Dominion", purchases: 15000 },
        { name: "England Fashion", thumbnail: "/images/fash5.png", seller: "Asuquo", purchases: 15000 },
        { name: "Peng", thumbnail: "/images/fash6.png", seller: "Dominion", purchases: 15000 },
    ],
  electronics: [
        { name: "Laptops", thumbnail: "/images/elect0.png", seller: "Dominion", purchases: 15000 },
        { name: "Laptops", thumbnail: "videos/campaign3.mp4", seller: "Dominion", purchases: 15000 },
        { name: "Speakers", thumbnail: "/images/elect1.png", seller: "Asuquo", purchases: 15000 },
        { name: "Transmitter", thumbnail: "/images/elect2.png", seller: "Dominion", purchases: 15000 },
        { name: "Mouse", thumbnail: "/images/elect3.png", seller: "Asuquo", purchases: 15000 },
        { name: "Camera", thumbnail: "/images/elect4.png", seller: "Dominion", purchases: 15000 },
        { name: "Phones", thumbnail: "/images/elect5.png", seller: "Asuquo", purchases: 15000 },
        { name: "AI speakers", thumbnail: "/images/elect6.png", seller: "Dominion", purchases: 15000 },
    ],

     home: [
        { name: "Home", thumbnail: "/images/home0.png", seller: "Dominion", purchases: 15000 },
        { name: "Home", thumbnail: "/images/home2.png", seller: "Dominion", purchases: 15000 },
        { name: "Home", thumbnail: "/images/home3.png", seller: "Asuquo", purchases: 15000 },
        { name: "Home", thumbnail: "/images/home5.png", seller: "Asuquo", purchases: 15000 },
        { name: "Home", thumbnail: "/images/home6.png", seller: "Dominion", purchases: 15000 },
    ],
     sports: [
        { name: "Football", thumbnail: "/images/sport0.png", seller: "Dominion", purchases: 15000 },
        { name: "Tennis", thumbnail: "/images/sport2.png", seller: "Dominion", purchases: 15000 },
    ],
};

// Type definition
export interface Category {
    name: string;
    image: string;
    seller: string;
    purchases: number;
}