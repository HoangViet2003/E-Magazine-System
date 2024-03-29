const GET_API = (id: string, page = 1) => {
  return {
    // article
    GET_DASHBOARD: `/article/dashboard`,
    GET_ALL_STUDENT_ARTICLES: `/article/student?page=${page}`,
    GET_ARTICLE_BY_ID: `/article/${id}`,
    GET_ARTICLES_BY_FACULTY_ID: `/article/faculty/${id}?page=${page}`,
    GET_ARTICLES_BY_SUBMISSION_ID: `/article/submission/${id}?page=${page}`,
    GET_SUGGESTION_ARTICLES: `/article/suggestions`,
    GET_FILTERED_ARTICLES: `/article/filter`,

    // comments
    GET_COMMENTS_BY_ARTICLE_ID: `/article/${id}/comments`,
    // contributions
    GET_ALL_CONTRIBUTIONS: `/contributions`,
    GET_ALL_CONTRIBUTIONS_BY_COORDINATOR: `/contributions/coordinator`,
    // faculties
    GET_ALL_FACULTIES: `/faculties`,
    GET_FACULTY_BY_ID: `/faculty/${id}`,
    // submissions
    GET_ALL_SUBMISSIONS: `/submissions`,
    GET_SUBMISSION_BY_CONTRIBUTION_ID: `/submissions/contribution/${id}`,
    GET_SUBMISSION_BY_STUDENT_ID: `/submission/student?contributionId=${id}`,
  };
};

const POST_API = (id: string) => {
  return {
    // authenticate
    LOGIN: "/login",
    SIGNUP: `/register`,
    // article
    UPLOAD_ARTICLE: "/article",
    CREATE_BLANK_WORD_FILE: "/article/create-doc",
    DOWNLOAD_ALL_SELECTED_ARTICLES: "/article/download",

    // comments
    ADD_COMMENT: `/article/${id}/comment`,
    REPLY_COMMENT: `/comment/${id}/reply`,
    // contributions
    CREATE_CONTRIBUTION: `/contribution`,
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
    UPDATE_CONTRIBUTION: `/contribution/${id}`,
    // faculties
    EDIT_FACULTY: `/faculty/${id}`,
    ADD_MARKETING_COORDINATOR: `/faculty/${id}/add-marketing-coordinator`,
    // submissions
    ADD_COMMENT_SUBMISSION: `/submission/${id}`,
    UPDATE_FOR_PUBLICATION: `/submission/publication`,
    UPDATE_SUBMISSION_FAVORITE: `/submission/favourite`,
  };
};

const DELETE_API = (id: string) => {
  return {
    // comments
    DELETE_COMMENT: `/comment/${id}`,
    // contributions
    DELETE_CONTRIBUTION: `/contribution/${id}`,
    // faculties
    DELETE_FACULTY: `/faculty/${id}`,
    // submissions
    DELETE_SUBMISSION: `/submission/${id}`,
  };
};

export { GET_API, POST_API, PUT_API, DELETE_API };
