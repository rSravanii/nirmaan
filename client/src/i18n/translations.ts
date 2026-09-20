import { SupportedLanguage } from '../types/index.js';

export interface TranslationSchema {
  appName: string;
  tagline: string;
  nav: {
    home: string;
    reportProblem: string;
    exploreProblems: string;
    dashboard: string;
    projects: string;
    evaluator: string;
    admin: string;
    leaderboard: string;
    presentation: string;
    login: string;
    logout: string;
  };
  hero: {
    title: string;
    subtitle: string;
    reportCta: string;
    exploreCta: string;
  };
  loop: {
    report: string;
    reportDesc: string;
    understand: string;
    understandDesc: string;
    match: string;
    matchDesc: string;
    resolve: string;
    resolveDesc: string;
    verify: string;
    verifyDesc: string;
    reward: string;
    rewardDesc: string;
  };
  reportForm: {
    heading: string;
    subheading: string;
    titleLabel: string;
    titlePlaceholder: string;
    descLabel: string;
    descPlaceholder: string;
    categoryLabel: string;
    districtLabel: string;
    villageLabel: string;
    villagePlaceholder: string;
    cameraCapture: string;
    retake: string;
    takeSnapshot: string;
    fileUploadFallback: string;
    voiceInput: string;
    voiceListening: string;
    anonymousCheckbox: string;
    offlineNotice: string;
    submitButton: string;
    submitting: string;
  };
  aiProcessing: {
    title: string;
    analyzing: string;
    detectedLang: string;
    englishSummary: string;
    category: string;
    severity: string;
    affectedPeople: string;
    suggestedDomains: string[];
    duplicateAlert: string;
    matchConfidence: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationSchema> = {
  en: {
    appName: 'Nirmaan',
    tagline: 'Crowdsourced Social Innovation Network — Government of Jharkhand',
    nav: {
      home: 'Home',
      reportProblem: 'Report Problem',
      exploreProblems: 'Explore Map & Problems',
      dashboard: 'Dashboard',
      projects: 'Projects Hub',
      evaluator: 'Authority Verifier',
      admin: 'State Admin',
      leaderboard: 'Leaderboard',
      presentation: 'Jury Presentation',
      login: 'Login',
      logout: 'Logout'
    },
    hero: {
      title: 'From Rural Problems to Real-World Solutions.',
      subtitle: 'Nirmaan connects communities, universities, researchers, and government to identify, solve, and verify rural challenges across Jharkhand.',
      reportCta: 'Report a Problem',
      exploreCta: 'Explore Problems'
    },
    loop: {
      report: 'REPORT',
      reportDesc: 'Citizens capture real rural problems with photos, GPS & voice in local languages.',
      understand: 'UNDERSTAND',
      understandDesc: 'AI translates, classifies severity, extracts entities, and consolidates duplicates.',
      match: 'MATCH',
      matchDesc: 'Smart matching engine connects problems to student teams and professor domains.',
      resolve: 'RESOLVE',
      resolveDesc: 'University researchers deploy prototypes, field test, and submit milestone evidence.',
      verify: 'VERIFY',
      verifyDesc: 'Jharkhand district authorities validate physical progress on the ground.',
      reward: 'REWARD',
      rewardDesc: 'Community and university contributors earn verified impact points & state honors.'
    },
    reportForm: {
      heading: 'Report a Rural Civic Problem',
      subheading: 'Speak or type in your native language. Our AI will translate, verify, and match your issue to university researchers.',
      titleLabel: 'Problem Title / Short Summary',
      titlePlaceholder: 'e.g., Broken bridge near our village prevents children from going to school',
      descLabel: 'Detailed Description',
      descPlaceholder: 'Describe what happened, how long the issue has persisted, and affected hamlets...',
      categoryLabel: 'Category',
      districtLabel: 'District (Jharkhand)',
      villageLabel: 'Village / Hamlet / Panchayat',
      villagePlaceholder: 'e.g., Hesal, Angara Block',
      cameraCapture: 'Open Live Camera',
      retake: 'Retake Photo',
      takeSnapshot: 'Capture Photo',
      fileUploadFallback: 'Or upload an image file from device',
      voiceInput: 'Tap to Speak (Voice Input)',
      voiceListening: 'Listening... speak now in any language',
      anonymousCheckbox: 'Report anonymously (masks name & contact)',
      offlineNotice: 'Offline Mode: Draft automatically saved to browser storage.',
      submitButton: 'Submit Problem Report',
      submitting: 'Processing with AI...'
    },
    aiProcessing: {
      title: 'AI Civic Orchestration Pipeline',
      analyzing: 'Analyzing problem through Multilingual NLP...',
      detectedLang: 'Detected Language',
      englishSummary: 'Standardized English Summary',
      category: 'Classified Category',
      severity: 'Assessed Severity',
      affectedPeople: 'Estimated Affected People',
      suggestedDomains: ['Civil Engineering', 'Rural Infrastructure'],
      duplicateAlert: 'Semantic Duplicate Detected',
      matchConfidence: 'Vector Similarity Confidence'
    }
  },
  hi: {
    appName: 'ग्रामउत्थान',
    tagline: 'जनसहयोग सामाजिक नवाचार नेटवर्क — झारखंड सरकार',
    nav: {
      home: 'मुख्य पृष्ठ',
      reportProblem: 'समस्या दर्ज करें',
      exploreProblems: 'समस्या मानचित्र देखें',
      dashboard: 'डैशबोर्ड',
      projects: 'परियोजनाएं',
      evaluator: 'अधिकारी सत्यापन',
      admin: 'राज्य प्रशासन',
      leaderboard: 'लीडरबोर्ड',
      presentation: 'जूरी प्रस्तुति',
      login: 'लॉग इन',
      logout: 'लॉग आउट'
    },
    hero: {
      title: 'ग्रामीण समस्याओं से वास्तविक समाधान तक।',
      subtitle: 'ग्रामउत्थान झारखंड के ग्रामीण क्षेत्रों की समस्याओं को पहचानने, हल करने और सत्यापित करने के लिए नागरिकों, विश्वविद्यालयों और सरकार को जोड़ता है।',
      reportCta: 'समस्या दर्ज करें',
      exploreCta: 'समस्याएं देखें'
    },
    loop: {
      report: 'रिपोर्ट (REPORT)',
      reportDesc: 'नागरिक अपनी भाषा में फोटो, जीपीएस और आवाज के साथ ग्रामीण समस्याएं दर्ज करते हैं।',
      understand: 'विश्लेषण (UNDERSTAND)',
      understandDesc: 'एआई अनुवाद करता है, गंभीरता निर्धारित करता है और डुप्लिकेट समस्याओं को मिलाता है।',
      match: 'मैच (MATCH)',
      matchDesc: 'स्मार्ट इंजन समस्या को योग्य छात्र टीमों और प्रोफेसरों से जोड़ता है।',
      resolve: 'समाधान (RESOLVE)',
      resolveDesc: 'विश्वविद्यालय के शोधकर्ता प्रोटोटाइप विकसित करते हैं और साक्ष्य अपलोड करते हैं।',
      verify: 'सत्यापन (VERIFY)',
      verifyDesc: 'जिला अधिकारी जमीनी स्तर पर कार्य का भौतिक सत्यापन करते हैं।',
      reward: 'सम्मान (REWARD)',
      rewardDesc: 'नागरिकों और शोधकर्ताओं को इम्पैक्ट अंक और राज्य स्तरीय सम्मान मिलता है।'
    },
    reportForm: {
      heading: 'ग्रामीण समस्या दर्ज करें',
      subheading: 'अपनी भाषा में लिखें या बोलें। एआई अनुवाद करके इसे विश्वविद्यालय के इंजीनियरों तक पहुंचाएगा।',
      titleLabel: 'समस्या का संक्षिप्त विवरण',
      titlePlaceholder: 'उदा. हमारे गाँव का पुल टूट गया है, बच्चे स्कूल नहीं जा पा रहे हैं',
      descLabel: 'विस्तृत जानकारी',
      descPlaceholder: 'क्या हुआ है, कितने लोग प्रभावित हैं और कब से यह समस्या है...',
      categoryLabel: 'श्रेणी',
      districtLabel: 'जिला (झारखंड)',
      villageLabel: 'गाँव / पंचायत',
      villagePlaceholder: 'उदा. हेसल, अनगड़ा प्रखंड',
      cameraCapture: 'कैमरा खोलें',
      retake: 'दोबारा फोटो लें',
      takeSnapshot: 'फोटो खींचें',
      fileUploadFallback: 'या मोबाइल/कंप्यूटर से फोटो चुनें',
      voiceInput: 'बोलकर दर्ज करें (वॉयस इनपुट)',
      voiceListening: 'सुन रहे हैं... कृपया बोलें...',
      anonymousCheckbox: 'गुमनाम रूप से दर्ज करें (पहचान गोपनीय रहेगी)',
      offlineNotice: 'ऑफ़लाइन मोड: ड्राफ्ट सुरक्षित रूप से सहेजा गया है।',
      submitButton: 'समस्या प्रेषित करें',
      submitting: 'एआई विश्लेषण जारी है...'
    },
    aiProcessing: {
      title: 'एआई विश्लेषण पाइपलाइन',
      analyzing: 'भाषा और समस्या का विश्लेषण जारी है...',
      detectedLang: 'पहचानी गई भाषा',
      englishSummary: 'मानकीकृत अंग्रेजी सारांश',
      category: 'पहचानी गई श्रेणी',
      severity: 'गंभीरता स्तर',
      affectedPeople: 'प्रभावित ग्रामीण',
      suggestedDomains: ['सिविल इंजीनियरिंग', 'ग्रामीण अधोसंरचना'],
      duplicateAlert: 'समान समस्या पहचानी गई (क्लस्टर)',
      matchConfidence: 'समानता प्रतिशत'
    }
  },
  te: {
    appName: 'గ్రామోత్థాన్',
    tagline: 'గ్రామీణ సమస్యల పరిష్కార వేదిక — జార్ఖండ్ ప్రభుత్వం',
    nav: {
      home: 'హోమ్',
      reportProblem: 'సమస్యను నివేదించండి',
      exploreProblems: 'సమస్యల మ్యాప్',
      dashboard: 'డ్యాష్‌బోర్డ్',
      projects: 'ప్రాజెక్టులు',
      evaluator: 'అధికార పరిశీలన',
      admin: 'అడ్మిన్',
      leaderboard: 'లీడర్‌బోర్డ్',
      presentation: 'జ్యూరీ డెమో',
      login: 'లాగిన్',
      logout: 'లాగౌట్'
    },
    hero: {
      title: 'గ్రామీణ సమస్యల నుండి నిజమైన పరిష్కారాల వరకు.',
      subtitle: 'గ్రామీణ సమస్యలను గుర్తించి, పరిష్కరించడానికి ప్రజలను, విశ్వవిద్యాలయాలను మరియు ప్రభుత్వాన్ని కలుపుతుంది.',
      reportCta: 'సమస్యను నివేదించండి',
      exploreCta: 'సమస్యలను అన్వేషించండి'
    },
    loop: {
      report: 'రిపోర్ట్ (REPORT)',
      reportDesc: 'స్థానిక భాషలో ఫోటో, వాయిస్ మరియు లొకేషన్‌తో సమస్యను నమోదు చేయండి.',
      understand: 'విశ్లేషణ (UNDERSTAND)',
      understandDesc: 'ఏఐ భాషను గుర్తించి, అనువదించి, డూప్లికేట్ సమస్యలను గుర్తిస్తుంది.',
      match: 'జతచేయడం (MATCH)',
      matchDesc: 'ఇంజనీరింగ్ విద్యార్థులు మరియు ప్రొఫెసర్లకు సమస్యను జతచేస్తుంది.',
      resolve: 'పరిష్కారం (RESOLVE)',
      resolveDesc: 'విద్యార్థులు ఫీల్డ్ వర్క్ చేసి పరిష్కార సాక్ష్యాలను అప్‌లోడ్ చేస్తారు.',
      verify: 'ధృవీకరణ (VERIFY)',
      verifyDesc: 'జిల్లా అధికారులు నేరుగా తనిఖీ చేసి ధృవీకరిస్తారు.',
      reward: 'రివార్డ్ (REWARD)',
      rewardDesc: 'ఇంపాక్ట్ పాయింట్లు మరియు రాష్ట్ర స్థాయి గుర్తింపు లభిస్తుంది.'
    },
    reportForm: {
      heading: 'గ్రామీణ సమస్యను నమోదు చేయండి',
      subheading: 'మీ మాతృభాషలో మాట్లాడండి లేదా టైప్ చేయండి.',
      titleLabel: 'సమస్య శీర్షిక',
      titlePlaceholder: 'ఉదా: మా ఊరి వంతెన విరిగిపోయింది, పిల్లలు దాటలేకపోతున్నారు',
      descLabel: 'పూర్తి వివరాలు',
      descPlaceholder: 'సమస్య గురించి వివరించండి...',
      categoryLabel: 'విభాగం',
      districtLabel: 'జిల్లా (జార్ఖండ్)',
      villageLabel: 'గ్రామం / పంచాయతీ',
      villagePlaceholder: 'ఉదా: హెసల్, అంగడ',
      cameraCapture: 'కెమెరా ఆన్ చేయండి',
      retake: 'మళ్ళీ తీయండి',
      takeSnapshot: 'ఫోటో తీయండి',
      fileUploadFallback: 'లేదా ఫైల్ అప్‌లోడ్ చేయండి',
      voiceInput: 'వాయిస్ ద్వారా మాట్లాడండి',
      voiceListening: 'వింటున్నాము... మాట్లాడండి...',
      anonymousCheckbox: 'గోప్యంగా నివేదించండి (పేరు దాచబడుతుంది)',
      offlineNotice: 'ఆఫ్‌లైన్ మోడ్: మీ డ్రాఫ్ట్ సురక్షితంగా భద్రపరచబడింది.',
      submitButton: 'సమస్యను పంపండి',
      submitting: 'ఏఐ ప్రాసెసింగ్ జరుగుతోంది...'
    },
    aiProcessing: {
      title: 'ఏఐ విశ్లేషణ వ్యవస్థ',
      analyzing: 'భాష మరియు సమస్య విశ్లేషణ జరుగుతోంది...',
      detectedLang: 'గుర్తించిన భాష',
      englishSummary: 'ఇంగ్లీష్ సారాంశం',
      category: 'విభాగం',
      severity: 'తీవ్రత',
      affectedPeople: 'ప్రభావితమైన జనాభా',
      suggestedDomains: ['సివిల్ ఇంజనీరింగ్', 'గ్రామీణ నిర్మాణాలు'],
      duplicateAlert: 'ఇలాంటి సమస్య ముందే నమోదైంది (క్లస్టర్)',
      matchConfidence: 'పోలిక శాతం'
    }
  },
  sat: {
    appName: 'Nirmaan (ᱥᱟᱱᱛᱟᱲᱤ)',
    tagline: 'ᱟᱹᱛᱩ ᱩᱛᱱᱟᱹᱣ ᱥᱟᱶᱛᱟ ᱱᱮᱴᱣᱟᱨᱠ — ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ',
    nav: {
      home: 'ᱢᱩᱬᱩᱛ (Home)',
      reportProblem: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ ᱢᱮ (Report)',
      exploreProblems: 'ᱱᱚᱠᱥᱟ ᱧᱮᱞ (Map)',
      dashboard: 'ᱰᱮᱥᱵᱚᱨᱰ',
      projects: 'ᱠᱟᱹᱢᱤᱦᱚᱨᱟ (Projects)',
      evaluator: 'ᱯᱟᱨᱠᱷᱟᱹᱣᱤᱭᱟᱹ (Evaluator)',
      admin: 'ᱥᱟᱥᱚᱱᱤᱭᱟᱹ (Admin)',
      leaderboard: 'ᱞᱤᱰᱚᱨᱵᱚᱨᱰ',
      presentation: 'ᱡᱩᱨᱤ ᱰᱮᱢᱚ',
      login: 'ᱵᱚᱞᱚᱱ (Login)',
      logout: 'ᱚᱰᱚᱠᱚᱜ'
    },
    hero: {
      title: 'ᱟᱹᱛᱩ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱠᱷᱚᱱ ᱥᱟᱹᱨᱤ ᱥᱚᱞᱦᱮ ᱦᱟᱹᱵᱤᱡ.',
      subtitle: 'ᱜᱨᱟᱢ ᱩᱛᱛᱷᱟᱱ ᱫᱚ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱟᱹᱛᱩ ᱠᱚᱨᱮᱱᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱥᱚᱞᱦᱮ ᱞᱟᱹᱜᱤᱫ ᱡᱚᱲᱟᱣ ᱮᱫᱟᱭ.',
      reportCta: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱞᱟᱹᱭ ᱢᱮ',
      exploreCta: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱠᱚ ᱧᱮᱞ ᱢᱮ'
    },
    loop: {
      report: 'ᱞᱟᱹᱭ (REPORT)',
      reportDesc: 'ᱟᱹᱛᱩ ᱨᱤᱱ ᱦᱚᱲ ᱠᱮᱢᱮᱨᱟ, ᱟᱲᱟᱝ ᱟᱨ ᱡᱤᱯᱤᱮᱥ ᱛᱮ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱠᱚ ᱞᱟᱹᱭᱟ.',
      understand: 'ᱵᱩᱡᱷᱟᱹᱣ (UNDERSTAND)',
      understandDesc: 'AI ᱯᱟᱹᱨᱥᱤ ᱛᱚᱨᱡᱚᱢᱟᱭᱟ ᱟᱨ ᱡᱚᱛᱚ ᱠᱷᱚᱵᱚᱨ ᱥᱟᱢᱵᱽᱲᱟᱣᱟ.',
      match: 'ᱡᱚᱲᱟᱣ (MATCH)',
      matchDesc: 'ᱤᱧᱡᱤᱱᱤᱭᱟᱹᱨ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱟᱨ ᱯᱨᱚᱯᱷᱮᱥᱚᱨ ᱠᱚ ᱥᱟᱶ ᱡᱚᱲᱟᱣᱟ.',
      resolve: 'ᱥᱚᱞᱦᱮ (RESOLVE)',
      resolveDesc: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱥᱟᱹᱨᱤ ᱠᱟᱹᱢᱤ ᱠᱟᱛᱮ ᱥᱚᱞᱦᱮ ᱠᱚ ᱚᱰᱚᱠᱟ.',
      verify: 'ᱯᱟᱨᱠᱷᱟᱹᱣ (VERIFY)',
      verifyDesc: 'ᱥᱚᱨᱠᱟᱨᱤ ᱟᱹᱯᱷᱤᱥᱟᱹᱨ ᱠᱚ ᱴᱷᱟᱶ ᱨᱮ ᱥᱮᱱ ᱠᱟᱛᱮ ᱠᱚ ᱧᱮᱞᱟ.',
      reward: 'ᱥᱤᱨᱯᱷᱟᱹ (REWARD)',
      rewardDesc: 'ᱮᱱᱮᱢ ᱮᱢᱚᱜᱤᱡ ᱠᱚ ᱤᱢᱯᱮᱠᱴ ᱯᱚᱭᱮᱸᱴ ᱟᱨ ᱥᱟᱨᱦᱟᱣ ᱠᱚ ᱧᱟᱢᱟ.'
    },
    reportForm: {
      heading: 'ᱟᱹᱛᱩ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱞᱟᱹᱭ ᱢᱮ',
      subheading: 'ᱟᱢᱟᱜ ᱟᱭᱳ ᱟᱲᱟᱝ ᱛᱮ ᱨᱚᱲ ᱢᱮ ᱵᱟᱝᱠᱷᱟᱱ ᱚᱞ ᱢᱮ. AI ᱤᱧᱡᱤᱱᱤᱭᱟᱹᱨ ᱠᱚ ᱴᱷᱮᱱ ᱥᱮᱴᱮᱨᱟ.',
      titleLabel: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱨᱮᱱᱟᱜ ᱧᱩᱛᱩᱢ',
      titlePlaceholder: 'ᱞᱮᱠᱟ: ᱟᱞᱮ ᱟᱹᱛᱩ ᱨᱮᱱᱟᱜ ᱥᱟᱠᱚᱣ ᱵᱟᱹᱜᱽᱲᱟᱣ ᱮᱱᱟ, ᱜᱤᱫᱽᱨᱟᱹ ᱵᱟᱝ ᱠᱚ ᱯᱟᱨᱚᱢ ᱫᱟᱲᱮᱭᱟᱜ ᱠᱟᱱᱟ',
      descLabel: 'ᱯᱩᱨᱟᱹ ᱵᱤᱵᱚᱨᱚᱬ',
      descPlaceholder: 'ᱪᱮᱫ ᱦᱩᱭ ᱟᱠᱟᱱᱟ, ᱛᱤᱱᱟᱹᱜ ᱦᱚᱲ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱨᱮ ᱢᱮᱱᱟᱜ ᱠᱚᱣᱟ...',
      categoryLabel: 'ᱛᱷᱚᱠ',
      districtLabel: 'ᱡᱤᱞᱟᱹ (ᱡᱷᱟᱨᱠᱷᱚᱸᱰ)',
      villageLabel: 'ᱟᱹᱛᱩ / ᱴᱚᱞᱟ',
      villagePlaceholder: 'ᱞᱮᱠᱟ: ᱦᱮᱥᱟᱞ, ᱚᱱᱜᱚᱲᱟ',
      cameraCapture: 'ᱠᱮᱢᱮᱨᱟ ᱡᱷᱤᱡᱽ ᱢᱮ',
      retake: 'ᱟᱨᱦᱚᱸ ᱯᱷᱚᱴᱚ ᱛᱩᱞᱟᱹᱣ ᱢᱮ',
      takeSnapshot: 'ᱯᱷᱚᱴᱚ ᱛᱩᱞᱟᱹᱣ ᱢᱮ',
      fileUploadFallback: 'ᱵᱟᱝᱠᱷᱟᱱ ᱯᱷᱟᱭᱤᱞ ᱟᱯᱞᱳᱰ ᱢᱮ',
      voiceInput: 'ᱨᱚᱲ ᱠᱟᱛᱮ ᱞᱟᱹᱭ ᱢᱮ (Voice Input)',
      voiceListening: 'ᱟᱸᱡᱚᱢ ᱮᱫᱟᱭ... ᱨᱚᱲ ᱢᱮ...',
      anonymousCheckbox: 'ᱩᱠᱩ ᱠᱟᱛᱮ ᱵᱷᱮᱡᱟᱭ ᱢᱮ (ᱧᱩᱛᱩᱢ ᱩᱠᱩ ᱛᱟᱦᱮᱸᱱᱟ)',
      offlineNotice: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱢᱳᱰ: ᱰᱨᱟᱯᱷᱴ ᱡᱚᱜᱟᱣ ᱮᱱᱟ.',
      submitButton: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱵᱷᱮᱡᱟᱭ ᱢᱮ',
      submitting: 'AI ᱛᱩᱞᱟᱹᱡᱚᱠᱷᱟ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ...'
    },
    aiProcessing: {
      title: 'AI ᱛᱩᱞᱟᱹᱡᱚᱠᱷᱟ ᱯᱟᱭᱤᱯᱞᱟᱭᱤᱱ',
      analyzing: 'ᱯᱟᱹᱨᱥᱤ ᱟᱨ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱵᱩᱡᱷᱟᱹᱣ ᱦᱩᱭᱩᱜ ᱠᱟᱱᱟ...',
      detectedLang: 'ᱧᱟᱢ ᱟᱠᱟᱱ ᱯᱟᱹᱨᱥᱤ',
      englishSummary: 'ᱤᱝᱨᱟᱹᱡᱤ ᱛᱮ ᱥᱟᱨᱟᱝᱥᱚ',
      category: 'ᱛᱷᱚᱠ (Category)',
      severity: 'ᱜᱟᱹᱦᱤᱨ ᱫᱷᱟᱯ (Severity)',
      affectedPeople: 'ᱮᱴᱠᱮᱴᱚᱬᱮ ᱨᱮ ᱢᱮᱱᱟᱜ ᱦᱚᱲ',
      suggestedDomains: ['ᱥᱤᱵᱷᱤᱞ ᱤᱧᱡᱤᱱᱤᱭᱟᱹᱨᱤᱝ', 'ᱟᱹᱛᱩ ᱵᱮᱱᱟᱣ-ᱨᱩᱣᱟᱹᱲ'],
      duplicateAlert: 'ᱱᱚᱝᱠᱟᱱ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱢᱟᱲᱟᱝ ᱠᱷᱚᱱ ᱦᱚᱸ ᱢᱮᱱᱟᱜ-ᱟ (Cluster)',
      matchConfidence: 'ᱢᱤᱫ ᱜᱮ ᱞᱮᱠᱟ ᱢᱮᱱᱟᱜ-ᱟ'
    }
  },
  mun: {
    appName: 'Nirmaan (Mundari)',
    tagline: 'Hatu Utthan Samajik Sanstha — Jharkhand Sarkar',
    nav: {
      home: 'Oro',
      reportProblem: 'Taklif Ol Me',
      exploreProblems: 'Map Nel Me',
      dashboard: 'Dashboard',
      projects: 'Kamihoraa',
      evaluator: 'Evaluator',
      admin: 'Admin',
      leaderboard: 'Leaderboard',
      presentation: 'Jury Demo',
      login: 'Bolo',
      logout: 'Ondoke'
    },
    hero: {
      title: 'Hatu Taklif Khen Sari Solhe Habij.',
      subtitle: 'Nirmaan connecting communities, universities, and Jharkhand government.',
      reportCta: 'Taklif Ol Me',
      exploreCta: 'Taklif Nel Me'
    },
    loop: {
      report: 'REPORT',
      reportDesc: 'Citizens report issues in Mundari with photo & audio.',
      understand: 'UNDERSTAND',
      understandDesc: 'AI translates, prioritizes, and clusters.',
      match: 'MATCH',
      matchDesc: 'Matches with engineering teams.',
      resolve: 'RESOLVE',
      resolveDesc: 'Students build real solutions.',
      verify: 'VERIFY',
      verifyDesc: 'Authorities verify on ground.',
      reward: 'REWARD',
      rewardDesc: 'Impact points and state recognition.'
    },
    reportForm: {
      heading: 'Hatu Taklif Ol Me',
      subheading: 'Ol me cha ror me native Mundari bhasha te.',
      titleLabel: 'Taklif Nutum',
      titlePlaceholder: 'e.g., Sanko barijana, honko iskool baiko sen daari tana',
      descLabel: 'Katha Purte',
      descPlaceholder: 'Chikan katha hobajana...',
      categoryLabel: 'Category',
      districtLabel: 'District (Jharkhand)',
      villageLabel: 'Hatu / Panchayat',
      villagePlaceholder: 'e.g., Angara',
      cameraCapture: 'Camera Jhi Me',
      retake: 'Oro photo tulau me',
      takeSnapshot: 'Photo Tulau Me',
      fileUploadFallback: 'File upload me',
      voiceInput: 'Ror me (Voice Input)',
      voiceListening: 'Aanjom tana... ror me...',
      anonymousCheckbox: 'Ukuku bhejaye me',
      offlineNotice: 'Offline Mode: Draft saved.',
      submitButton: 'Bhejaye Me',
      submitting: 'AI analysis tana...'
    },
    aiProcessing: {
      title: 'AI Processing Engine',
      analyzing: 'Analyzing problem through AI...',
      detectedLang: 'Mundari / Auto-detected',
      englishSummary: 'English Summary',
      category: 'Category',
      severity: 'Severity',
      affectedPeople: 'Affected villagers',
      suggestedDomains: ['Civil Engineering', 'Rural Development'],
      duplicateAlert: 'Duplicate Report Detected',
      matchConfidence: 'Vector Similarity'
    }
  },
  ho: {
    appName: 'Nirmaan (Ho)',
    tagline: 'Hatu Pragati Network — Jharkhand Sarkar',
    nav: {
      home: 'Home',
      reportProblem: 'Taklif Kaji Me',
      exploreProblems: 'Map Nel Me',
      dashboard: 'Dashboard',
      projects: 'Kami',
      evaluator: 'Officer',
      admin: 'Admin',
      leaderboard: 'Leaderboard',
      presentation: 'Jury Demo',
      login: 'Login',
      logout: 'Logout'
    },
    hero: {
      title: 'Hatu Taklif Aete Sari Baiy-Ruar Habij.',
      subtitle: 'Nirmaan connecting Ho hamlets, universities, and Jharkhand state.',
      reportCta: 'Taklif Kaji Me',
      exploreCta: 'Map Nel Me'
    },
    loop: {
      report: 'REPORT',
      reportDesc: 'Report problems with photo and audio in Ho.',
      understand: 'UNDERSTAND',
      understandDesc: 'AI translates and groups issues.',
      match: 'MATCH',
      matchDesc: 'Matches to university researchers.',
      resolve: 'RESOLVE',
      resolveDesc: 'Field implementation and milestones.',
      verify: 'VERIFY',
      verifyDesc: 'Jharkhand authorities certify completion.',
      reward: 'REWARD',
      rewardDesc: 'State badges and impact awards.'
    },
    reportForm: {
      heading: 'Hatu Taklif Kaji Me',
      subheading: 'Kaji me cha ol me Ho jagar te.',
      titleLabel: 'Taklif Title',
      titlePlaceholder: 'e.g., Sanko bagro-yana, gowa kaji baiko parom daari tana',
      descLabel: 'Bistrit Kaji',
      descPlaceholder: 'Chikan taklif mena...',
      categoryLabel: 'Category',
      districtLabel: 'District (Jharkhand)',
      villageLabel: 'Hatu / Panchayat',
      villagePlaceholder: 'e.g., Jhinkpani, Chaibasa',
      cameraCapture: 'Camera Niyor Me',
      retake: 'Auri Foto Tulau Me',
      takeSnapshot: 'Foto Tulau Me',
      fileUploadFallback: 'Foto Upload Me',
      voiceInput: 'Kaji Me (Voice Input)',
      voiceListening: 'Aayum tana... kaji me...',
      anonymousCheckbox: 'Ukuku kaji me',
      offlineNotice: 'Offline Mode: Draft saved.',
      submitButton: 'Kaji Kul Me',
      submitting: 'AI Kami Tana...'
    },
    aiProcessing: {
      title: 'AI Processing Engine',
      analyzing: 'AI analyzing Ho language input...',
      detectedLang: 'Ho / Auto-detected',
      englishSummary: 'English Normalized Summary',
      category: 'Category',
      severity: 'Severity',
      affectedPeople: 'Affected Population',
      suggestedDomains: ['Electrical Engineering', 'Civil Engineering'],
      duplicateAlert: 'Cluster Match Detected',
      matchConfidence: 'Similarity Percentage'
    }
  }
};
