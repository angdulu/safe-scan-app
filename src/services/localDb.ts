export interface Product {
  names: string[];
  ingredients: string[];
}

export interface HazardWarning {
  summary: string;
  details: string;
}

export interface IngredientHazard {
  names: string[]; // Aliases/names in Korean and English
  hazards: {
    condition: string; // The conceptual condition (e.g. 'NUT_ALLERGY', 'CELIAC', etc.)
    level: 'SAFE' | 'CAUTION' | 'DANGER';
    warnings: {
      ko: HazardWarning;
      en: HazardWarning;
    };
  }[];
}

export const CONDITION_MAP: { [key: string]: string[] } = {
  NUT_ALLERGY: ['nut allergy', 'peanut allergy', '견과류 알레르기', '땅콩 알레르기', '견과류', '땅콩'],
  CELIAC: ['celiac', 'celiac disease', 'gluten allergy', 'gluten sensitivity', '셀리악병', '셀리악', '글루텐 민감성'],
  DIGESTIVE: ['digestive disorder', 'digestive', 'stomach issues', '위장 장애', '소화 장애'],
  DERMATITIS: ['skin dermatitis', 'dermatitis', 'eczema', 'skin allergy', 'sensitive skin', '피부염', '아토피', '습진', '민감성 피부', '피부'],
  RESPIRATORY: ['asthma', 'respiratory issues', 'respiratory disease', 'respiratory', '천식', '호흡기 질환', '호흡기'],
  DAIRY_ALLERGY: ['dairy allergy', 'milk allergy', 'lactose intolerance', '유제품 알레르기', '우유 알레르기', '유당불내증', '유제품', '우유'],
  DIABETES: ['diabetes', '당뇨', '당뇨병'],
  HYPERTENSION: ['hypertension', 'high blood pressure', '고혈압'],
  PREGNANCY: ['pregnant', 'pregnancy', '임산부', '임신'],
  THYROID: ['thyroid disease', 'thyroid', '갑상선 질환', '갑상선']
};

export const PRODUCTS: Product[] = [
  {
    names: ['skippy creamy peanut butter', 'skippy', '스키피 크리미 땅콩버터', '스키피 땅콩버터', '스키피'],
    ingredients: ['Roasted Peanuts', 'Sugar', 'Hydrogenated Vegetable Oil', 'Salt', '구운 땅콩', '설탕', '경화식물성유지', '소금']
  },
  {
    names: ['shin ramyun', 'shin ramen', '신라면', '농심 신라면'],
    ingredients: ['Wheat Flour', 'Palm Oil', 'Potato Starch', 'Salt', 'Wheat Gluten', 'MSG', 'Soy Sauce', 'Yeast Extract', 'Red Pepper', 'Garlic', '소밀가루', '팜유', '감자전분', '정제소금', '밀글루텐', 'L-글루타민산나트륨', '간장', '효모추출물', '고춧가루', '마늘']
  },
  {
    names: ['tide liquid laundry detergent', 'tide detergent', 'tide', '타이드 세제', '타이드 액체세제'],
    ingredients: ['Water', 'Sodium Lauryl Sulfate', 'Sodium Laureth Sulfate', 'Fragrance', 'Alcohol Ethoxylate', 'Diethylene Glycol', '물', '라우릴황산나트륨', '라우레스황산나트륨', '향료', '알코올에톡실레이트', '디에틸렌글리콜']
  },
  {
    names: ['lysol disinfectant spray', 'lysol', '라이솔 스프레이', '라이솔 소독 스프레이'],
    ingredients: ['Ethanol', 'Alkyl Dimethyl Benzyl Ammonium Saccharinate', 'Aerosol Propellant', 'Fragrance', '에탄올', '염화알킬디메틸벤질암모늄', '에어로졸 분사제', '향료']
  },
  {
    names: ['johnson\'s baby cream', 'johnson baby cream', '존슨즈 베이비 크림', '존슨즈 베이비크림'],
    ingredients: ['Water', 'Glycerin', 'Mineral Oil', 'Fragrance', 'Stearyl Alcohol', 'Carbomer', 'Phenoxyethanol', '정제수', '글리세린', '미네랄오일', '향료', '스테아릴알코올', '카보머', '페녹시에탄올']
  },
  {
    names: ['coca-cola classic', 'coca cola', 'coke', '코카콜라', '콜라'],
    ingredients: ['Carbonated Water', 'High Fructose Corn Syrup', 'Caramel Color', 'Phosphoric Acid', 'Natural Flavors', 'Caffeine', '탄산수', '액상과당', '카라멜색소', '인산', '천연향료', '카페인']
  },
  {
    names: ['maeil milk', 'maeil whole milk', '매일우유', '매일 우유'],
    ingredients: ['Raw Milk', '100% Raw Milk', '국산 원유 100%', '원유', '우유']
  },
  {
    names: ['vaseline intensive care cocoa radiant lotion', 'vaseline cocoa radiant', '바세린 코코아 로션', '바세린 코코아 래디언트'],
    ingredients: ['Water', 'Glycerin', 'Stearic Acid', 'Isopropyl Palmitate', 'Glycol Stearate', 'Fragrance', 'Limonene', 'Methylparaben', '정제수', '글리세린', '스테아릭애씨드', '이소프로필팔미테이트', '글라이콜스테아레이트', '향료', '리모넨', '메틸파라벤']
  },
  {
    names: ['febreze air effects', 'febreze', '페브리즈 에어', '페브리즈 에어 이펙트', '페브리즈'],
    ingredients: ['Water', 'Alcohol', 'Odor Eliminator', 'Fragrance', 'Nitrogen Gas Aerosol', '정제수', '에탄올', '탈취제', '향료', '질소가스 에어로졸']
  },
  {
    names: ['starbucks americano', 'starbucks coffee', '스타벅스 아메리카노', '아메리카노'],
    ingredients: ['Water', 'Espresso (Water, Coffee Beans)', '물', '에스프레소(물, 커피원두)', '카페인']
  },
  {
    names: ['bullsone rainok spray', 'rainok spray', '불스원 레인ok', '레인ok 스프레이'],
    ingredients: ['Ethanol', 'Silicone Emulsion', 'Propellant Gas Aerosol', '에탄올', '실리콘에멀젼', '분사제 에어로졸']
  },
  {
    names: ['spam classic', 'spam', '스팸 클래식', '스팸'],
    ingredients: ['Pork', 'Water', 'Salt', 'Sugar', 'Sodium Nitrite', '돼지고기', '정제수', '소금', '백설탕', '아질산나트륨']
  },
  {
    names: ['downy fabric softener', 'downy', '다우니 섬유유연제', '다우니'],
    ingredients: ['Water', 'Cationic Surfactant', 'Fragrance', 'Limonene', 'Hexyl Cinnamal', 'Preservatives', '물', '양이온계면활성제', '향료', '리모넨', '헥실신남알', '보존제']
  },
  {
    names: ['yuhan rox', 'clorox bleach', '유한락스', '락스', '클로락스 표백제'],
    ingredients: ['Water', 'Sodium Hypochlorite', '정제수', '차아염소산나트륨']
  },
  {
    names: ['sun chips', 'sunchips', '썬칩', '태양의 맛 썬칩'],
    ingredients: ['Whole Corn', 'Whole Wheat', 'Rice Flour', 'Oat Flour', 'Sunflower Oil', 'Sugar', 'Salt', 'Whey Powder', '통옥수수', '통밀', '쌀가루', '귀리가루', '해바라기유', '설탕', '소금', '유청분말']
  },
  {
    names: ['aveeno daily moisturizing lotion', 'aveeno lotion', '아비노 로션', '아비노 데일리 모이스처라이징'],
    ingredients: ['Dimethicone', 'Water', 'Glycerin', 'Distearyldimonium Chloride', 'Petrolatum', 'Isopropyl Palmitate', 'Cetyl Alcohol', 'Colloidal Oatmeal', 'Benzyl Alcohol', 'Sodium Chloride', '디메치콘', '정제수', '글리세린', '디스테아릴디모늄클로라이드', '바세린', '이소프로필팔미테이트', '세틸알코올', '콜로이달오트밀', '벤질알코올', '염화나트륨']
  },
  {
    names: ['choco pie', 'orion choco pie', '초코파이', '오리온 초코파이'],
    ingredients: ['Wheat Flour', 'Sugar', 'Corn Syrup', 'Vegetable Fats', 'Cocoa Powder', 'Whole Milk Powder', 'Gelatin', 'Egg', 'Salt', 'Vanilla Extract', '밀가루', '백설탕', '물엿', '식물성유지', '코코아분말', '전지분유', '젤라틴', '전란액', '식염', '바닐라향']
  },
  {
    names: ['dr pepper', 'dr. pepper', '닥터페퍼', '닥터 페퍼'],
    ingredients: ['Carbonated Water', 'High Fructose Corn Syrup', 'Caramel Color', 'Phosphoric Acid', 'Artificial and Natural Flavors', 'Sodium Benzoate', 'Caffeine', '탄산수', '액상과당', '카라멜색소', '인산', '천연및인공향료', '안식향산나트륨', '카페인']
  },
  {
    names: ['sensodyne fresh mint toothpaste', 'sensodyne toothpaste', '센소다인 치약', '센소다인 프레쉬민트'],
    ingredients: ['Sodium Fluoride', 'Potassium Nitrate', 'Water', 'Sorbitol', 'Hydrated Silica', 'Glycerin', 'Cocamidopropyl Betaine', 'Flavor', 'Sodium Saccharin', 'Xanthan Gum', 'Titanium Dioxide', '불화나트륨', '질산칼륨', '정제수', '소르비톨', '함수이산화규소', '글리세린', '코카미도프로필베타인', '향료', '사카린나트륨', '잔탄검', '이산화티타늄']
  },
  {
    names: ['nutella hazelnut spread', 'nutella', '누텔라'],
    ingredients: ['Sugar', 'Palm Oil', 'Hazelnuts', 'Skim Milk Powder', 'Cocoa Powder', 'Soy Lecithin', 'Vanillin', '설탕', '팜유', '헤이즐넛', '탈지분유', '코코아분말', '대두레시틴', '바닐린']
  }
];

export const INGREDIENT_HAZARDS: IngredientHazard[] = [
  {
    names: ['peanuts', 'peanut', 'roasted peanuts', '땅콩', '구운 땅콩'],
    hazards: [
      {
        condition: 'NUT_ALLERGY',
        level: 'DANGER',
        warnings: {
          ko: {
            summary: '경고: 견과류 알레르기를 유발하는 땅콩이 포함되어 있습니다.',
            details: '이 제품은 땅콩(Peanuts)을 함유하고 있어 견과류 알레르기 환자에게 심각한 아나필락시스 반응을 유발할 수 있습니다. 대한민국 식품의약품안전처(MFDS) 및 미국 FDA 지침에 따르면 알레르기 유발 물질은 엄격히 섭취를 금지해야 합니다.'
          },
          en: {
            summary: 'Danger: Contains peanuts which triggers your allergy.',
            details: 'This product contains peanuts, which can trigger severe anaphylactic reactions in individuals with nut allergies. According to US FDA and WHO guidelines, strict allergen avoidance is required.'
          }
        }
      }
    ]
  },
  {
    names: ['hazelnuts', 'hazelnut', '헤이즐넛'],
    hazards: [
      {
        condition: 'NUT_ALLERGY',
        level: 'DANGER',
        warnings: {
          ko: {
            summary: '경고: 견과류 알레르기를 유발하는 헤이즐넛이 포함되어 있습니다.',
            details: '이 제품은 헤이즐넛(Hazelnuts)을 함유하고 있어 견과류 알레르기 환자에게 알레르기 반응을 유발할 수 있습니다. 식약처(MFDS) 및 FDA 기준에 따라 즉각적인 섭취 중단이 요구됩니다.'
          },
          en: {
            summary: 'Danger: Contains hazelnuts which triggers your allergy.',
            details: 'This product contains hazelnuts, which are known to trigger allergic reactions in individuals with tree nut allergies. According to FDA and European Food Safety Authority (EFSA) regulations, avoiding exposure is crucial.'
          }
        }
      }
    ]
  },
  {
    names: ['wheat', 'gluten', 'wheat flour', 'wheat gluten', '밀', '글루텐', '밀가루', '소밀가루', '밀글루텐'],
    hazards: [
      {
        condition: 'CELIAC',
        level: 'DANGER',
        warnings: {
          ko: {
            summary: '경고: 셀리악병 환자에게 유해한 밀/글루텐 성분이 포함되어 있습니다.',
            details: '밀과 글루텐 성분은 셀리악병이나 글루텐 민감성 환자의 장 점막에 면역 염증 반응을 일으켜 융모를 손상시킬 수 있습니다. WHO 및 FDA 기준에 따라 엄격한 글루텐 프리 식단 준수가 권고됩니다.'
          },
          en: {
            summary: 'Danger: Contains wheat/gluten which triggers Celiac Disease.',
            details: 'Wheat and gluten trigger an autoimmune response that damages the small intestinal lining in individuals with Celiac Disease. According to WHO and FDA standards, a strict gluten-free diet is required.'
          }
        }
      },
      {
        condition: 'DIGESTIVE',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 소화 장애를 유발할 수 있는 밀/글루텐 성분이 포함되어 있습니다.',
            details: '밀에 함유된 글루텐 단백질은 소화가 잘 되지 않아 가스, 복부 팽만감, 설사 등의 위장 장애 증상을 악화시킬 수 있습니다. 민감한 소화기관을 가진 사용자는 섭취량을 조절하시는 것이 좋습니다.'
          },
          en: {
            summary: 'Caution: Contains wheat/gluten which may cause digestive issues.',
            details: 'Gluten protein in wheat is hard to digest and can aggravate gastrointestinal symptoms like bloating and abdominal discomfort in people with digestive disorders.'
          }
        }
      }
    ]
  },
  {
    names: ['fragrance', 'flavor', '향료'],
    hazards: [
      {
        condition: 'DERMATITIS',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 피부염을 유발할 수 있는 향료가 포함되어 있습니다.',
            details: '인공 향료는 피부 접촉성 피부염, 습진 및 아토피 피부염의 대표적인 유발 인자 중 하나입니다. EU 및 식약처 규정에 따라 민감성 피부나 장벽이 약화된 피부에는 사용 자제가 권장됩니다.'
          },
          en: {
            summary: 'Caution: Contains fragrance which may cause skin irritation.',
            details: 'Artificial fragrances are common contact allergens that can trigger eczema or contact dermatitis. EU Cosmetics Regulation and US FDA guidelines recommend avoiding fragranced products for sensitive skin.'
          }
        }
      },
      {
        condition: 'RESPIRATORY',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 호흡기 질환을 유발할 수 있는 향료가 포함되어 있습니다.',
            details: '향료 속 휘발성 유기화합물은 기도 점막을 자극하여 천식 발작이나 호흡기 불편감을 유발할 수 있어 밀폐된 곳에서의 분사 또는 과도한 사용 시 주의가 필요합니다.'
          },
          en: {
            summary: 'Caution: Contains fragrance which may trigger respiratory issues.',
            details: 'Volatile compounds in fragrances can irritate respiratory tract linings and trigger asthma symptoms or coughing, as noted by national thoracic standards.'
          }
        }
      }
    ]
  },
  {
    names: ['limonene', '리모넨'],
    hazards: [
      {
        condition: 'DERMATITIS',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 접촉성 피부염을 유발할 수 있는 리모넨 성분이 포함되어 있습니다.',
            details: '리모넨은 공기 중의 산소와 반응하여 산화할 때 강력한 접촉성 알레르겐을 형성합니다. EU 과학위원회(SCCS)에서 규정하는 알레르기 유발 항원 리스트에 포함되어 있으며 민감성 피부염 유발률이 높습니다.'
          },
          en: {
            summary: 'Caution: Contains limonene which can cause skin irritation.',
            details: 'Limonene is a common fragrance chemical that oxidizes upon contact with air, forming highly sensitizing compounds that trigger dermatitis. It is monitored closely under EU cosmetics regulations.'
          }
        }
      }
    ]
  },
  {
    names: ['sodium lauryl sulfate', 'sls', 'sodium laureth sulfate', 'sles', '라우릴황산나트륨', '소듐라우릴설페이트', '라우레스황산나트륨', '소듐라우레스설페이트'],
    hazards: [
      {
        condition: 'DERMATITIS',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 피부 장벽을 약화시키는 계면활성제(SLS/SLES)가 포함되어 있습니다.',
            details: '소듐라우릴설페이트(SLS)는 강한 세정력으로 피부 보호막을 파괴하여 극심한 건조증 및 접촉성 피부염을 유발할 수 있습니다. 미국 피부과학회(AAD)에서는 아토피성 피부염 환자에게 이 성분의 사용 제한을 권고합니다.'
          },
          en: {
            summary: 'Caution: Contains Sodium Lauryl Sulfate (SLS) which may dry or irritate skin.',
            details: 'SLS is a harsh surfactant that strips the skin\'s natural lipid barrier, causing dryness and exacerbating eczema or dermatitis. Dermatological guidelines advise avoidance.'
          }
        }
      }
    ]
  },
  {
    names: ['aerosol propellant', 'isobutane', 'propane', 'nitrogen gas aerosol', '에어로졸 분사제', '에어로졸', '이소부탄', '프로판', '질소가스 에어로졸'],
    hazards: [
      {
        condition: 'RESPIRATORY',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 호흡기 자극을 유발할 수 있는 에어로졸 분사제가 포함되어 있습니다.',
            details: '스프레이 제품에서 분사되는 에어로졸 가스는 직접 흡입 시 미세 입자가 폐 깊숙이 도달하여 기관지를 자극하고 천식 환자의 급성 호흡 곤란을 유발할 수 있어 밀폐 공간 내 사용을 지양해야 합니다.'
          },
          en: {
            summary: 'Caution: Contains aerosol propellants which can irritate airways.',
            details: 'Inhaling aerosolized propellants can irritate bronchial tubes and worsen asthma or chronic obstructive pulmonary disease (COPD), according to WHO safety reports.'
          }
        }
      }
    ]
  },
  {
    names: ['sodium hypochlorite', '차아염소산나트륨', '염소계 표백제'],
    hazards: [
      {
        condition: 'RESPIRATORY',
        level: 'DANGER',
        warnings: {
          ko: {
            summary: '경고: 호흡기 점막에 심한 자극을 주는 차아염소산나트륨이 포함되어 있습니다.',
            details: '염소계 표백제(락스)의 주성분인 차아염소산나트륨은 유기물과 반응하여 유독성 염소가스를 생성합니다. 이는 기도 점막을 강하게 손상시키고 천식 발작을 유발하므로 식약처 및 환경부 지침에 따라 철저히 환기해야 합니다.'
          },
          en: {
            summary: 'Danger: Contains sodium hypochlorite which is a severe respiratory irritant.',
            details: 'Sodium hypochlorite releases chlorine fumes that can severely damage respiratory tracts and trigger acute asthma attacks. US EPA and OSHA guidelines require using this chemical only in well-ventilated areas.'
          }
        }
      },
      {
        condition: 'DERMATITIS',
        level: 'DANGER',
        warnings: {
          ko: {
            summary: '경고: 피부 화상 및 심각한 접촉성 피부염을 유발하는 차아염소산나트륨이 포함되어 있습니다.',
            details: '차아염소산나트륨은 강알칼리 물질로 단백질을 용해하여 피부염 및 화학적 화상을 유발합니다. 피부 접촉 시 즉시 물로 세척해야 하며 보호 장갑 등 안전장비 착용이 필수적입니다.'
          },
          en: {
            summary: 'Danger: Contains sodium hypochlorite which can cause chemical burns and severe dermatitis.',
            details: 'It is highly alkaline and breaks down skin proteins, leading to severe chemical dermatitis or burns. Safety standards require protective gloves and eye protection.'
          }
        }
      }
    ]
  },
  {
    names: ['high fructose corn syrup', 'sugar', 'corn syrup', '액상과당', '설탕', '백설탕', '물엿'],
    hazards: [
      {
        condition: 'DIABETES',
        level: 'DANGER',
        warnings: {
          ko: {
            summary: '경고: 혈당을 급격히 상승시키는 과도한 당류/액상과당이 포함되어 있습니다.',
            details: '정제 설탕과 액상과당은 소화 흡수가 매우 빨라 급격한 혈당 스파이크를 유발하고 인슐린 저항성을 증가시킵니다. 대한당뇨병학회(IDA) 및 WHO 기준에 따라 당뇨 환자는 섭취를 엄격히 제한해야 합니다.'
          },
          en: {
            summary: 'Danger: Contains high fructose corn syrup/sugar which spikes blood glucose.',
            details: 'Refined sugar and high fructose corn syrup are rapidly absorbed, leading to sharp blood glucose spikes and worsening insulin resistance. ADA and WHO guidelines advise strict limitations.'
          }
        }
      }
    ]
  },
  {
    names: ['caffeine', 'espresso', '카페인', '에스프레소'],
    hazards: [
      {
        condition: 'PREGNANCY',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 임산부와 태아에게 유해할 수 있는 카페인이 포함되어 있습니다.',
            details: '카페인은 태반을 자유롭게 통과하여 태아에게 도달하나 태아는 카페인을 분해하는 효소가 부족합니다. WHO 및 식약처 권고 기준에 따라 임산부의 하루 카페인 섭취량은 200~300mg 이하로 제한되어야 합니다.'
          },
          en: {
            summary: 'Caution: Contains caffeine which is restricted during pregnancy.',
            details: 'Caffeine crosses the placenta easily, and the fetus lacks the enzymes to metabolize it. WHO and FDA guidelines recommend limiting daily intake to under 200 mg during pregnancy.'
          }
        }
      },
      {
        condition: 'HYPERTENSION',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 일시적인 혈압 상승을 유발할 수 있는 카페인이 포함되어 있습니다.',
            details: '카페인은 아데노신 수용체를 차단하고 교감신경을 자극하여 일시적인 혈압 상승 및 심박수 증가를 유발하므로 고혈압 환자는 섭취 조절이 필요합니다.'
          },
          en: {
            summary: 'Caution: Contains caffeine which can temporarily raise blood pressure.',
            details: 'Caffeine acts as a transient vasoconstrictor and stimulant, raising blood pressure and heart rate. Hypertensive individuals should monitor and limit high dosage consumption.'
          }
        }
      }
    ]
  },
  {
    names: ['raw milk', 'milk', 'skim milk powder', 'whole milk powder', 'whey powder', '국산 원유 100%', '원유', '우유', '탈지분유', '전지분유', '유청분말'],
    hazards: [
      {
        condition: 'DAIRY_ALLERGY',
        level: 'DANGER',
        warnings: {
          ko: {
            summary: '경고: 유제품 알레르기를 유발하는 우유 성분이 포함되어 있습니다.',
            details: '우유 단백질(카제인 등)은 두드러기, 가려움증부터 호흡 곤란, 아나필락시스 쇼크와 같은 치명적인 알레르기 반응을 일으킬 수 있으므로 식약처 및 FDA 기준에 따라 섭취를 금지해야 합니다.'
          },
          en: {
            summary: 'Danger: Contains dairy ingredients which trigger milk allergy.',
            details: 'Milk proteins can trigger severe allergic reactions including hives, swelling, asthma, and life-threatening anaphylaxis. Strict avoidance is mandated under FDA allergen regulations.'
          }
        }
      },
      {
        condition: 'DIGESTIVE',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 유당불내증 및 소화 불량을 유발할 수 있는 유청/우유 성분이 포함되어 있습니다.',
            details: '우유에 함유된 유당(Lactose)을 분해하는 락타아제 효소가 부족한 경우 소장에서 유당이 흡수되지 못해 설사, 팽만감, 복통을 유발할 수 있습니다.'
          },
          en: {
            summary: 'Caution: Contains dairy which may trigger lactose intolerance or digestive discomfort.',
            details: 'Lactose in dairy products cannot be easily digested by individuals lacking the lactase enzyme, leading to intestinal fermentation, bloating, gas, and diarrhea.'
          }
        }
      }
    ]
  },
  {
    names: ['sodium nitrite', '아질산나트륨'],
    hazards: [
      {
        condition: 'PREGNANCY',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 임산부에게 유해할 수 있는 식품첨가물 아질산나트륨이 포함되어 있습니다.',
            details: '육가공품 보존제로 쓰이는 아질산나트륨은 태반을 통해 태아의 산소 공급을 방해하거나 빈혈(메트헤모글로빈혈증)을 유발할 수 있다는 우려가 있어 임산부는 섭취를 지양해야 합니다.'
          },
          en: {
            summary: 'Caution: Contains sodium nitrite, which requires caution during pregnancy.',
            details: 'Sodium nitrite, used in processed meats, can react to form nitrosamines and might interfere with fetal oxygen carriage. Regulatory advice recommends minimizing consumption during pregnancy.'
          }
        }
      },
      {
        condition: 'HYPERTENSION',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 고혈압을 악화시킬 수 있는 고나트륨 가공 가공 성분입니다.',
            details: '아질산나트륨이 들어간 가공육류는 대체로 나트륨 함량이 매우 높습니다. 이는 체내 수분 정체를 유도하여 혈압을 증가시키므로 고혈압 환자는 섭취 조절이 절대적으로 요구됩니다.'
          },
          en: {
            summary: 'Caution: Preserved meat additives and high sodium can worsen hypertension.',
            details: 'Processed meats cured with sodium nitrite are high in sodium, which causes fluid retention and elevates blood pressure. Hypertension management guidelines advocate avoiding processed meats.'
          }
        }
      }
    ]
  },
  {
    names: ['phenoxyethanol', '페녹시에탄올'],
    hazards: [
      {
        condition: 'DERMATITIS',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 피부 자극 및 알레르기를 유발할 수 있는 페녹시에탄올이 포함되어 있습니다.',
            details: '화장품 방부제 성분으로, 피부 장벽이 손상된 접촉성 피부염이나 아토피 피부염 환자에게 알레르기 가려움증, 두드러기 등의 피부 자극 반응을 일으킬 수 있어 주의가 요구됩니다.'
          },
          en: {
            summary: 'Caution: Contains phenoxyethanol, a preservative that may cause skin irritation.',
            details: 'Phenoxyethanol is a cosmetic preservative that can cause contact sensitization, rash, or localized irritation in people with eczema or highly sensitive skin.'
          }
        }
      }
    ]
  },
  {
    names: ['methylparaben', '메틸파라벤'],
    hazards: [
      {
        condition: 'DERMATITIS',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 접촉성 피부염을 유발할 수 있는 파라벤 방부제가 포함되어 있습니다.',
            details: '메틸파라벤은 보존제로서 장벽이 무너진 피부에 침투하여 가려움, 발진 등의 접촉성 피부염 증상을 악화시킬 수 있습니다. 가급적 파라벤 프리 제품 사용을 권장합니다.'
          },
          en: {
            summary: 'Caution: Contains methylparaben which can cause skin irritation.',
            details: 'Parabens can cause skin irritation and contact dermatitis in individuals with pre-existing skin barrier issues or eczema.'
          }
        }
      }
    ]
  },
  {
    names: ['colloidal oatmeal', 'oat flour', 'oats', '콜로이달오트밀', '귀리가루', '귀리'],
    hazards: [
      {
        condition: 'CELIAC',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 귀리(오트) 성분이 포함되어 있어 셀리악 환자는 주의가 필요합니다.',
            details: '귀리 단백질인 아베닌은 드물게 글루텐 유사 반응을 유발할 수 있습니다. 또한, 재배 과정에서 밀과 혼입(교차 오염)되는 경우가 흔하므로 인증된 글루텐 프리 마크가 있는 제품이 아닌 경우 주의해야 합니다.'
          },
          en: {
            summary: 'Caution: Contains oat ingredients which celiac patients should monitor.',
            details: 'Oats are frequently cross-contaminated with wheat during agricultural processing. Some celiac patients also show sensitivity to avenin, a protein in oats.'
          }
        }
      }
    ]
  },
  {
    names: ['monosodium glutamate', 'msg', 'l-글루타민산나트륨'],
    hazards: [
      {
        condition: 'DIGESTIVE',
        level: 'CAUTION',
        warnings: {
          ko: {
            summary: '주의: 소화 불편을 유발할 수 있는 L-글루타민산나트륨(MSG)이 포함되어 있습니다.',
            details: '일부 위장 장애 또는 과민 반응이 있는 사용자는 대량의 MSG를 섭취할 시 두통, 구토, 위장 팽만감 및 소화 불량을 경험할 수 있습니다.'
          },
          en: {
            summary: 'Caution: Contains Monosodium Glutamate (MSG) which may cause sensitivity or digestive issues.',
            details: 'MSG can cause mild, transient sensitivity symptoms (like headache, bloating, or nausea) in sensitive individuals when consumed in higher concentrations.'
          }
        }
      }
    ]
  }
];
