
export type Recipe = {
    RCP_PARTS_DTLS?: string;
    RCP_WAY2?: string;
    MANUAL_IMGS?: string[]; // 조리 이미지 배열
    MANUALS?: string[]; // 조리 방법 배열
    ATT_FILE_NO_MAIN?: string;
    RCP_PAT2?: string;
    RECIPE_RAW_MATR?: string;
    RECIPE_NM_KO?: string;
    RCP_NM?: string;
    RCP_NA_TIP?: string;
  };
  
  export type ApiResponse = {
    COOKRCP01?: {
      row?: Recipe[];
    };
  };
  
  export type RecipePart = Recipe["RCP_PARTS_DTLS"];
  