/* UrbanCart product catalogue. Prices in INR. Row: name, category, subCategory, MRP, sale price, rating, reviews, stock, popularity, description, specs */
export const CATEGORIES=[{name:'Electronics',icon:'🎧'},{name:'Fashion',icon:'👗'},{name:'Footwear',icon:'👟'},{name:'Home & Living',icon:'🛋️'},{name:'Beauty',icon:'💄'},{name:'Accessories',icon:'👜'}];
const OPTIONS={Electronics:{colors:['Black','White','Blue'],sizes:[]},Fashion:{colors:['Navy','Maroon','Olive'],sizes:['S','M','L','XL']},Footwear:{colors:['Black','Brown','White'],sizes:['UK 6','UK 7','UK 8','UK 9','UK 10']},'Home & Living':{colors:['White','Grey','Beige'],sizes:[]},Beauty:{colors:[],sizes:[]},Accessories:{colors:['Black','Brown','Tan'],sizes:[]}};
const RAW=[
['Wireless Bluetooth Headphones','Electronics','',3499,1999,4.4,1280,25,95,'Over-ear headphones with deep bass and 30-hour battery.','Battery:30 hrs;Bluetooth:5.3;Weight:250 g'],
['Smart Fitness Watch Pro','Electronics','',5999,3499,4.3,860,40,90,'AMOLED display, heart-rate and SpO2 tracking, 7-day battery.','Display:1.43" AMOLED;Water resistance:5 ATM;Battery:7 days'],
['Portable Bluetooth Speaker','Electronics','',2999,1799,4.5,2140,18,88,'Splash-proof 20W speaker with 12 hours of playtime.','Output:20 W;Playtime:12 hrs;Rating:IPX6'],
['True Wireless Earbuds','Electronics','',2499,1299,4.1,3300,60,97,'Compact earbuds with touch controls and a charging case.','Playtime:24 hrs with case;Bluetooth:5.2;Charging:USB-C'],
['20000mAh Fast Charge Power Bank','Electronics','',1999,1399,4.2,970,35,70,'Slim power bank with 22.5W fast charging and dual output.','Capacity:20000 mAh;Output:22.5 W;Ports:USB-A, USB-C'],
['Mechanical Gaming Keyboard','Electronics','',4999,3299,4.6,540,12,65,'RGB backlit keyboard with hot-swappable blue switches.','Switches:Blue mechanical;Layout:87-key;Backlight:RGB'],
['4K Action Camera','Electronics','',12999,8999,4.0,310,0,40,'Waterproof 4K camera with image stabilisation and Wi-Fi.','Video:4K 60 fps;Waterproof:30 m;Battery:1350 mAh'],
['Active Noise-Cancelling Headphones','Electronics','',14999,10999,4.7,720,9,75,'Premium ANC headphones with 40-hour battery and mic array.','ANC:Hybrid;Battery:40 hrs;Codec:LDAC, AAC'],
['Cotton Casual Shirt','Fashion','Men',1499,799,4.2,1520,80,85,'Breathable pure cotton shirt with a regular fit.','Fabric:100% cotton;Fit:Regular;Wash:Machine'],
['Floral Print Cotton Kurti','Fashion','Women',1999,1199,4.4,1010,55,80,'Straight-fit kurti with all-over floral print.','Fabric:Cotton;Sleeve:3/4;Length:Knee'],
['Slim Fit Stretch Jeans','Fashion','Men',2499,1499,4.3,2210,70,92,'Mid-rise stretch denim for all-day comfort.','Fabric:98% cotton, 2% elastane;Rise:Mid;Fit:Slim'],
['Classic Denim Jacket','Fashion','Women',3499,2299,4.5,430,22,60,'Washed denim jacket with button front and two pockets.','Fabric:Denim;Fit:Relaxed;Closure:Buttons'],
['Fleece Hooded Sweatshirt','Fashion','Men',2199,1299,4.4,890,48,72,'Warm fleece hoodie with kangaroo pocket.','Fabric:Cotton fleece;Fit:Regular;Pockets:1'],
['Kanchipuram Style Silk Saree','Fashion','Women',4999,3299,4.6,260,12,55,'Silk-blend saree with woven zari border and blouse piece.','Fabric:Silk blend;Length:5.5 m;Blouse:Included'],
['Lightweight Running Shoes','Footwear','Men',3999,2499,4.4,1760,45,94,'Cushioned mesh running shoes with a grippy outsole.','Upper:Mesh;Sole:EVA;Use:Running'],
['Leather Formal Shoes','Footwear','Men',4499,2999,4.3,640,20,58,'Genuine leather lace-ups for office and occasions.','Upper:Leather;Sole:TPR;Closure:Lace-up'],
['Block Heel Sandals','Footwear','Women',1999,1099,4.1,780,33,62,'Comfortable 2-inch block heels with ankle strap.','Heel:2 in;Upper:Synthetic;Closure:Buckle'],
['Canvas Sneakers','Footwear','Women',1799,999,4.2,1990,90,86,'Everyday low-top sneakers in washed canvas.','Upper:Canvas;Sole:Rubber;Style:Low-top'],
['Waterproof Trekking Boots','Footwear','Men',6999,4999,4.7,210,3,45,'Ankle-high boots with ridged grip for rough trails.','Upper:Nubuck;Waterproof:Yes;Sole:Vibram-style'],
['Ceramic Dinner Set (18 pcs)','Home & Living','',3999,2799,4.5,690,16,68,'Microwave-safe dinner set for six with matte glaze.','Pieces:18;Material:Ceramic;Serves:6'],
['Memory Foam Pillow','Home & Living','',1999,1199,4.3,1430,52,78,'Contoured pillow that supports neck and shoulders.','Fill:Memory foam;Size:60 x 40 cm;Cover:Removable'],
['LED Study Table Lamp','Home & Living','',1499,899,4.2,820,38,64,'Dimmable lamp with 3 colour modes and USB charging.','Modes:3;Power:10 W;Flexible neck:Yes'],
['Cotton Double Bedsheet Set','Home & Living','',2499,1499,4.4,1120,41,74,'300 thread-count cotton sheet with two pillow covers.','Thread count:300;Size:Double;Includes:2 covers'],
['Insulated Steel Water Bottle','Home & Living','',899,549,4.6,3050,120,89,'Double-wall bottle keeps drinks cold 24 hrs, hot 12 hrs.','Capacity:1 L;Material:Steel 304;Leak-proof:Yes'],
['Vitamin C Face Serum','Beauty','',999,599,4.3,2480,75,91,'Brightening 10% Vitamin C serum for daily use.','Volume:30 ml;Skin type:All;Key:Vitamin C'],
['Matte Lipstick Set (4 shades)','Beauty','',1299,799,4.2,1340,60,69,'Long-wear matte lipsticks in four everyday shades.','Shades:4;Finish:Matte;Wear:8 hrs'],
['Argan Hair Oil','Beauty','',599,399,4.4,1870,100,73,'Nourishing argan oil for frizz control and shine.','Volume:100 ml;Hair type:All;Key:Argan oil'],
['Sunscreen SPF 50 PA+++','Beauty','',699,449,4.5,2960,85,87,'Lightweight, non-greasy broad-spectrum sunscreen.','Volume:50 g;SPF:50 PA+++;Finish:Matte'],
['Genuine Leather Wallet','Accessories','',1299,699,4.3,1650,64,76,'Slim bifold wallet with RFID protection and 6 card slots.','Material:Leather;Card slots:6;RFID:Yes'],
['Polarized Sunglasses','Accessories','',2499,1299,4.2,930,44,63,'UV400 polarized aviators with a metal frame.','Lens:Polarized;UV:400;Frame:Metal'],
['Laptop Backpack 30L','Accessories','',2999,1699,4.5,1580,30,82,'Water-resistant backpack with padded 15.6" laptop sleeve.','Capacity:30 L;Laptop:Up to 15.6";Material:Polyester'],
['Classic Analog Wrist Watch','Accessories','',5999,3999,4.4,470,15,59,'Stainless-steel analog watch with date window.','Case:40 mm;Strap:Steel;Water resistance:3 ATM']
];
export const IMAGE_KEYWORDS=['headphones','smartwatch','speaker','earbuds','powerbank','keyboard','actioncamera','headphones','shirt','kurti','jeans','denimjacket','hoodie','saree','runningshoes','dressshoes','sandals','sneakers','hikingboots','plates','pillow','desklamp','bedsheet','waterbottle','skincare','lipstick','haircare','sunscreen','wallet','sunglasses','backpack','wristwatch'];
/* images are matched to each product by keyword; edit IMAGE_KEYWORDS (same order as RAW) or put your own URLs in images */
const PRODUCTS=RAW.map((r,i)=>{const id=i+1;return{id,name:r[0],category:r[1],subCategory:r[2],description:r[9],price:r[3],salePrice:r[4],discount:Math.round((r[3]-r[4])/r[3]*100),rating:r[5],reviews:r[6],stock:r[7],stockStatus:r[7]<=0?'Out of Stock':r[7]<=5?'Only '+r[7]+' left':'In Stock',images:[1,2,3].map(n=>`https://loremflickr.com/600/600/${IMAGE_KEYWORDS[i]}?lock=${id*10+n}`),specifications:Object.fromEntries(r[10].split(';').map(s=>s.split(':'))),colors:OPTIONS[r[1]].colors,sizes:OPTIONS[r[1]].sizes,popularity:r[8],createdAt:new Date(Date.now()-((i*37)%90)*864e5).toISOString().slice(0,10)}});
export const getProduct=id=>PRODUCTS.find(p=>p.id===Number(id));
