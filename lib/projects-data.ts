export interface ProjectStage {
  id: string
  title: string
  title_ta: string
  description: string
  description_ta: string
  image: string
  date: string
}

export interface Project {
  id: string
  title: string
  title_ta: string
  location: string
  location_ta: string
  total_area: string
  total_area_ta: string
  ground_floor: string
  ground_floor_ta: string
  first_floor: string
  first_floor_ta: string
  highlights?: string
  highlights_ta?: string
  thumbnail: string
  featured: boolean
  completionDate: string
  status: "Completed" | "In Progress"
  stages: ProjectStage[]
  gallery?: string[]
}

export const projects: Project[] = [
  {
    id: "site-3-abdul-gafoor",
    title: "Site-3 (Mr. Abdul Gafoor)",
    title_ta: "திரு. அப்துல் கபூர் அவர்களின் இல்லம்",
    location: "Suraikkakkollai Street, Adirampattinam",
    location_ta: "சுரைக்காக்கொல்லைத் தெரு, அதிராம்பட்டினம்",
    total_area: "2420 Sq.ft.",
    total_area_ta: "2420 சதுர அடி",
    ground_floor: "Two bedrooms with attached baths, spacious Hall, Kitchen, Car Parking, Rear Washroom/Utility area. (1367 Sq.ft.)",
    ground_floor_ta: "இரண்டு படுக்கை அறைகள் (அட்டாச்டு பாத்ரூம்), விசாலாமான ஹால், சமையலறை, கார் பார்க்கிங், பின்புறம் பயன்பாட்டு பகுதி. (1367 Sq.ft.)",
    first_floor: "Front Office with Balcony, Two bedrooms (attached baths), Common Hall, Terrace Shed. (1053 Sq.ft.)",
    first_floor_ta: "முன்புறம் ஆபீஸ் அறை (பால்கனி உடன்), இரண்டு படுக்கை அறைகள், பொது ஹால், மேற்கூரை செட். (1053 Sq.ft.)",
    thumbnail: "/photos/site_3/SITE-3.jpg",
    featured: true,
    completionDate: "2024",
    status: "Completed",
    stages: [],
    gallery: [
      "/photos/site_3/SITE-3.jpg",
      "/photos/site_3/SITE_3__10_.jpg",
      "/photos/site_3/SITE_3__11_.jpg",
      "/photos/site_3/SITE_3__27_.jpg",
      "/photos/site_3/SITE_3__30_.jpg",
      "/photos/site_3/SITE_3__35_.jpg"
    ]
  },
  {
    id: "site-4-yousuf",
    title: "Site-4 (Mr. Yousuf)",
    title_ta: "தளம் 4 (திரு. யூசுப்)",
    location: "Middle Street, Adirampattinam",
    location_ta: "மிடில் ஸ்ட்ரீட், அதிராம்பட்டினம்",
    total_area: "2000 Sq.ft.",
    total_area_ta: "2000 சதுர அடி",
    ground_floor: "1 BHK layout, Spacious Hall, Sit-out area, Modular Kitchen. (861 Sq.ft.)",
    ground_floor_ta: "1 BHK, பெரிய ஹால், சிட்-அவுட், மாடுலர் கிச்சன். (861 Sq.ft.)",
    first_floor: "3 Bedrooms with attached baths, Balcony, Open-sky headroom. (861 Sq.ft.)",
    first_floor_ta: "3 படுக்கையறைகள் (அட்டாச்டு பாத்ரூம்), பால்கனி, ஓபன் ஸ்கை ஹெட் ரூம். (861 Sq.ft.)",
    highlights: "Pure River Sand, Ultratech Cement, Dulux Paint.",
    highlights_ta: "ஆற்று மணல், Ultratech சிமெண்ட், Dulux பெயிண்ட்.",
    thumbnail: "/photos/site_4/WhatsApp_Image_2024-04-06_at_16.17.30_1cde91d0.jpg",
    featured: true,
    completionDate: "2024",
    status: "In Progress",
    stages: [],
    gallery: [
      "/photos/site_4/site_4__6_.jpg",
      "/photos/site_4/site_4__1_.jpg",
      "/photos/site_4/site_4__2_.jpg",
      "/photos/site_4/site_4__3_.jpg",
      "/photos/site_4/site_4__4_.jpg",
      "/photos/site_4/site_4__5_.jpg",
      "/photos/site_4/site_4__6_.jpg"
    ]
  },
  {
    id: "site-5-mr-faizal",
    title: "Site-5 (Mr. Faizal Ahamed)",
    title_ta: "தளம் 5 (திரு. ஃபைஸல் அஹமத்)",
    location: "Haja Nagar, Adirampattinam",
    location_ta: "ஹாஜா நகர், அதிராம்பட்டினம்",
    total_area: "1171 Sq.ft.",
    total_area_ta: "1171 சதுர அடி",
    ground_floor: "2BHK - Two comfortable bedrooms with attached bathrooms, Spacious living hall with modern design, Common toilet & parking area, 4 feet elevated basement, Modern kitchen with well-planned layout & compound wall, Safe septic tank and essential interior facilities. (1398 Sq.ft.)",
    ground_floor_ta: "2BHK - 2 வசதியான படுக்கையறைகள் அட்டாச்டு பாத்ரூம், நவீன ஸ்டைலில் வடிவமைக்கப்பட்ட பரந்த ஹால், காமன் டாய்லெட் & வசதியான பார்க்கிங் இடம், 4 அடி உயரப்பட்ட அடித்தளம் (Basement), நவீன சமையலறை & காம்பவுண்ட் சுவர், பாதுகாப்பான செப்டிக் டேங்க் மற்றும் அனைத்து உள் வசதிகளும். (1398 சதுர அடி)",
    first_floor: "-",
    first_floor_ta: "-",
    thumbnail: "/photos/site_5/site_5___6_.jpg",
    featured: true,
    completionDate: "2025",
    status: "Completed",
    stages: [],
    gallery: [
      "/photos/site_5/IMG_20250411_111708086.jpg",
      "/photos/site_5/IMG_20250418_180438790.jpg",
      "/photos/site_5/IMG_20250418_180627553.jpg",
      "/photos/site_5/site_5___1_.jpg",
      "/photos/site_5/site_5___2_.jpg",
      "/photos/site_5/site_5___3_.jpg",
      "/photos/site_5/site_5___5_.jpg",
      "/photos/site_5/site_5___6_.jpg",
      "/photos/site_5/site_5___7_.jpg",
      "/photos/site_5/site_5___8_.jpg",
      "/photos/site_5/site_5___9_.jpg"
    ]
  },
  {
    id: "site-6-nizam",
    title: "Site-6 (Mr. Nizam)",
    title_ta: "தளம் 6 (திரு. நிஜாம்)",
    location: "Hospital Street, Adirampattinam",
    location_ta: "ஹாஸ்பிடல் தெரு, அதிராம்பட்டினம்",
    total_area: "3700 Sq.ft.",
    total_area_ta: "3700 சதுர அடி",
    ground_floor: "2BHK - One bedroom with attached bathroom, One hall & one common toilet, Modern kitchen with beautiful interiors. (1600 Sq.ft.)",
    ground_floor_ta: "2BHK - ஒரு படுக்கையறை + இணைந்த குளியலறை, ஒரு கூடம் & ஒரு பொதுக் கழிப்பறை, அழகிய இன்டீரியர்ஸ் கொண்ட மாடர்ன் சமையலறை. (1600 சதுர அடி)",
    first_floor: "Two bedrooms with attached bathrooms, Spacious combined hall, Access to 500 sq.ft Head Room (Open Sky Concept). (1600 Sq.ft.)",
    first_floor_ta: "இரண்டு படுக்கையறைகள் + இணைந்த குளியலறைகள், விசாலமான combined ஹால், 500 sq.ft அளவுள்ள Head Room (Open Sky Concept) பகுதியை அணுகலாம். (1600 சதுர அடி)",
    thumbnail: "/photos/SITE_6/WhatsApp_Image_2025-09-02_at_11.47.48_45e082af.jpg",
    featured: true,
    completionDate: "2024",
    status: "Completed",
    stages: [],
    gallery: [
      "/photos/SITE_6/IMG_20250222_114318947_MF_PORTRAIT.jpg",
      "/photos/SITE_6/IMG_20250318_073756384.jpg",
      "/photos/SITE_6/IMG_20250323_134554972_MF_PORTRAIT.jpg",
      "/photos/SITE_6/IMG_20250405_131122324_HDR.jpg",
      "/photos/SITE_6/IMG_20250405_131135675_HDR.jpg",
      "/photos/SITE_6/site_6__10_.jpg",
      "/photos/SITE_6/site_6__11_.jpg",
      "/photos/SITE_6/site_6__12_.jpg",
      "/photos/SITE_6/site_6__13_.jpg",
      "/photos/SITE_6/site_6__14_.jpg",
      "/photos/SITE_6/site_6__15_.jpg",
      "/photos/SITE_6/site_6__16_.jpg",
      "/photos/SITE_6/site_6__17_.jpg",
      "/photos/SITE_6/site_6__1_.jpg",
      "/photos/SITE_6/site_6__2_.jpg",
      "/photos/SITE_6/site_6__3_.jpg",
      "/photos/SITE_6/site_6__4_.jpg",
      "/photos/SITE_6/site_6__5_.jpg",
      "/photos/SITE_6/site_6__6_.jpg",
      "/photos/SITE_6/site_6__7_.jpg",
      "/photos/SITE_6/site_6__8_.jpg",
      "/photos/SITE_6/site_6__9_.jpg"
    ]
  },
  {
    id: "site-7-reffai-ahamed",
    title: "Site-7 (Mr. Reffai Ahamed)",
    title_ta: "தளம் 7 (திரு. ரிஃபாய் அகமது)",
    location: "Ibrahim Masjid Street, Adirampattinam",
    location_ta: "இப்ராஹீம் மஸ்ஜித் தெரு, அதிராம்பட்டினம்",
    total_area: "1472 Sq.ft.",
    total_area_ta: "1472 சதுர அடி",
    ground_floor: "3 BHK, Spacious modern hall, Car parking, 6ft Elevated Basement, Modular Kitchen. (1398 Sq.ft.)",
    ground_floor_ta: "3 BHK, நவீன ஹால், கார் பார்க்கிங், 6 அடி உயர அடித்தளம், மாடுலர் கிச்சன். (1398 Sq.ft.)",
    first_floor: "1 Bedroom (attached bath), Elegant Elevation Balcony, Waiting Hall. (204 Sq.ft.)",
    first_floor_ta: "1 படுக்கையறை (அட்டாச்டு பாத்ரூம்), எலிவேஷன் பால்கனி, வெயிட்டிங் ஹால். (204 Sq.ft.)",
    thumbnail: "/photos/SITE_7/Refai_Ahamed_View_1.jpg",
    featured: true,
    completionDate: "2024",
    status: "In Progress",
    stages: [],
    gallery: [
      "/photos/SITE_7/Refai_Ahamed_View_2.jpg",
      "/photos/SITE_7/IMG_20241007_131813795.jpg",
      "/photos/SITE_7/IMG_20250317_152212765_MF_PORTRAIT.jpg",
      "/photos/SITE_7/IMG_20250317_173505457_HDR.jpg",
      "/photos/SITE_7/IMG_20250317_173517279_MF_PORTRAIT.jpg",
      "/photos/SITE_7/IMG_20250412_105635125_HDR.jpg",
      "/photos/SITE_7/IMG_20250412_105732726.jpg",
      "/photos/SITE_7/IMG_20250611_103231306_MF_PORTRAIT.jpg",
      "/photos/SITE_7/IMG_20250729_131601352_MF_PORTRAIT.jpg"
    ]
  },
  {
    id: "site-9-haja",
    title: "Site-9 (Mr. Haja Nasrutheen)",
    title_ta: "தளம் 9 (திரு. ஹாஜா நஸ்ருதீன்)",
    location: "Beach Road, Adirampattinam",
    location_ta: "கடற்கரைத் தெரு, அதிராம்பட்டினம்",
    total_area: "1800 Sq.ft.",
    total_area_ta: "1800 சதுர அடி",
    ground_floor: "2BHK - Comfortable bedrooms with attached bathrooms, Spacious hall in modern style, Well-planned modular kitchen, Large hall with round-shaped stairs. (1400 Sq.ft.)",
    ground_floor_ta: "2BHK - வசதியான படுக்கையறைகள் & இணைக்கப்பட்ட கழிப்பறை, நவீன ஸ்டைலில் வடிவமைக்கப்பட்ட பரந்த ஹால், சீரிய முறையில் அமைக்கப்பட்ட மாடுலர் கிச்சன், பெரிய ஹால் & முதல் தளத்திற்குச் செல்ல நேர்த்தியான வட்டமான படிக்கட்டுகள். (1400 சதுர அடி)",
    first_floor: "Stylish elevation balcony, One bedroom with attached bathroom, Access to terrace, External staircase. (400 Sq.ft.)",
    first_floor_ta: "நேர்த்தியான எலிவேஷன் பால்கனி, அட்டாச்டு பாத்ரூமும் உடன் கூடிய ஒரு படுக்கையறை, மேல்தளம் (Terrace) செல்லும் வசதி, வெளிப்புற படிக்கட்டு (External Steps). (400 சதுர அடி)",
    thumbnail: "/photos/site_9/img.png",
    featured: true,
    completionDate: "2024",
    status: "In Progress",
    stages: [],
    gallery: [
      "/photos/site_9/IMG_20241203_113911356_MF_PORTRAIT.jpg",
      "/photos/site_9/IMG_20241206_103251817.jpg",
      "/photos/site_9/IMG_20241211_161921030.jpg",
      "/photos/site_9/IMG_20241211_161926184_MF_PORTRAIT.jpg",
      "/photos/site_9/IMG_20241211_161940261.jpg",
      "/photos/site_9/IMG_20250721_112437666_MF_PORTRAIT.jpg",
      "/photos/site_9/IMG_20250729_131348014.jpg",
      "/photos/site_9/IMG_20250923_102514567_AE.jpg",
      "/photos/site_9/IMG_20250923_102610250.jpg",
      "/photos/site_9/IMG_20250923_102630004_HDR_AE.jpg",
      "/photos/site_9/IMG_20250923_103541244_HDR.jpg",
      "/photos/site_9/IMG_20250923_103608495.jpg",
      "/photos/site_9/IMG_20250928_145637629_HDR_AE.jpg",
      "/photos/site_9/IMG_20250928_145716740_AE.jpg"
    ]
  }
]