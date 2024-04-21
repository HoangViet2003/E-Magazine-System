const GET_API = (
  id: string,
  page = 1,
  year?: number,
  chosenRange = "This month",
) => {
  return {
    // article
    GET_DASHBOARD: `/article/dashboard?chosenRange=${chosenRange}`,
    GET_ALL_STUDENT_ARTICLES: `/article/student?page=${page}`,
    GET_ARTICLE_BY_ID: `/article/${id}`,
    GET_ARTICLES_BY_FACULTY_ID: `/article/faculty/${id}?page=${page}`,
    GET_ARTICLES_BY_SUBMISSION_ID: `/article/submission/${id}?page=${page}`,
    GET_SUGGESTION_ARTICLES: `/article/suggestions`,
    GET_FILTERED_ARTICLES: `/article/filter?page=${page}`,

    // comments
    // GET_COMMENTS_BY_ARTICLE_ID: `/article/${id}/comments`,
    GET_COMMENTS_BY_SUBMISSION_ID: `/submission/${id}/comments?page=${page}`,
    // contributions
    GET_CONTRIBUTION_BY_ID: `/contribution/${id}`,
    GET_ALL_CONTRIBUTIONS: `/contributions?page=${page}`,
    GET_ALL_CONTRIBUTIONS_BY_COORDINATOR: `/contributions/coordinator`,
    GET_ALL_CONTRIBUTIONS_BY_ACADEMIC_YEAR: `/contributions/academic-year?academicYear=${year}`,
    GET_ALL_CONTRIBUTIONS_FOR_ADMIN: `/contributions/admin?page=${page}`,
    SEARCH_CONTRIBUTION: `/search-contribution?page=${page}`,

    // faculties
    GET_ALL_FACULTIES: `/faculties?page=${page}`,
    GET_FACULTY_BY_ID: `/faculty/${id}`,
    SEARCH_FACULTY: `/search-faculty?page=${page}`,

    // submissions
    GET_SUBMISSION_BY_SUBMISSION_ID: `/submission/${id}`,
    GET_SUBMISSION_BY_CONTRIBUTION_ID: `/submissions/contribution/${id}`,
    GET_SUBMISSION_BY_CONTRIBUTION_ID_FOR_STUDENT: `/submission/contribution/${id}`,
    GET_SUBMISSION_BY_STUDENT_ID: `/submission/student?contributionId=${id}`,
    GET_UNSELECTED_ARTICLES_OF_STUDENTS: `/submission/${id}/unselectedArticles`,
    DOWNLOAD_SUBMISSION: `/submission/${id}/download`,

    //notifications
    GET_ALL_NOTIFICATIONS: `/notifications?page=${page}`,

    //users
    GET_ALL_USERS: `/users?page=${page}`,
    SEARCH_USERS: `/search-user?page=${page}`,
  };
};

const POST_API = (id?: string,token?:any) => {
  return {
    // authenticate
    LOGIN: "/login",
    SIGNUP: `/user`,
    FORGOT_PASSWORD: "/confirm-reset-password",
    RESET_PASSWORD: `/reset-password?token=${token}`,

    // article
    UPLOAD_ARTICLE: "/article",
    CREATE_BLANK_WORD_FILE: "/article/create-doc",
    DOWNLOAD_ALL_SELECTED_ARTICLES: "/article/download",

    // comments
    // ADD_COMMENT: `/article/${id}/comment`,
    CREATE_COMMENT: `/submission/${id}/comment`,
    REPLY_COMMENT: `/comment/${id}/reply`,
    // contributions
    CREATE_CONTRIBUTION: `/contributions`,
    // faculties
    CREATE_FACULTY: `/faculty`,
    // submissions
    CREATE_SUBMISSION: `/submission`,
  };
};

const PUT_API = (id: string) => {
  return {
    // article
    UPDATE_ARTICLE: `/article/${id}`,
    UPDATE_ARTICLE_FAVORITE: `/article/favourite`,
    UPDATE_ARTICLES_FOR_PUBLICATION: `/article/publication`,

    // contributions
    UPDATE_CONTRIBUTION: `/contributions`,

    ADD_MARKETING_COORDINATOR: `/faculty/${id}/add-marketing-coordinator`,
    // submissions
    ADD_COMMENT_SUBMISSION: `/submission/${id}`,
    UPDATE_FOR_PUBLICATION: `/submission/publication`,
    UPDATE_SUBMISSION_FAVORITE: `/submission/favourite`,
    ADD_ARTICLES_TO_SUBMISSION: `/submission/${id}/addArticle`,
    REMOVE_ARTICLES_FROM_SUBMISSION: `/submission/${id}/removeArticle`,
  };
};

const DELETE_API = (id: string) => {
  return {
    // articles
    DELETE_ARTICLE: `/article/${id}`,
    // comments
    DELETE_COMMENT: `/comment/${id}`,
    // contributions
    DELETE_CONTRIBUTION: '/contributions',

    // faculties
    DELETE_FACULTY: `/faculty/${id}`,
    // submissions
    DELETE_SUBMISSION: `/submission/${id}`,

    //user
    DELETE_USER: `/user/${id}`,
    
  };
};

const PATCH_API = (id: string) => {
  return {
    // submissions
    TOGGLE_PUBLICATION: `/submission/${id}/publication`,
    TOGGLE_SUBMIT: `/submission/${id}/submit`,

    //user
    EDIT_USER: `/user/${id}`,

    // faculties
    EDIT_FACULTY: `/faculty/${id}`,

    //notifications
    UPDATE_UNSEEN_NOTIFICATIONS: `/notification`,
  };
};

export { GET_API, POST_API, PUT_API, DELETE_API, PATCH_API };
