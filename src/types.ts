type ContentsSongs = {
    order_num: number;
    video_id: string;
    added_at: string;
    updated_at: string;
    track_description: string;
};

type ContentsOwner = {
    user_id: number;
    user_name: string;
    nickname: string;
    avatar_url: string;
    status: string;
};

type SuccessPlaylistContents = {
    status: "succeeded";
    list_id: string;
    list_title: string;
    created_at: string;
    updated_at: string;
    description: string;
    owner: ContentsOwner;
    songs: ContentsSongs[];
};

type FailedPlaylistContents = {
    status: "failed";
    error: {
        message: string;
    };
};

type targetField = "title" | "description" | "tags" | "tagsExact";
type allField = {
    contentId: string | null,
    title: string | null,
    description: string | null,
    userId: number | null,
    channelId: number | null,
    viewCounter: number | null,
    mylistCounter: number | null,
    likeCounter: number | null,
    lengthSeconds: number | null,
    thumbnailUrl: string | null,
    startTime: string | null, // ISO8601形式
    lastResBody: string | null,
    commentCounter: number | null,
    lastCommentTime: string | null, // ISO8601形式
    categoryTags: string | null,
    tags: string | null,
    tagsExact: string | null,
    genre: string | null,
    "genre.keyword": string | null,
};
type exactNames = "tagsExact" | "genre.keyword";
type countableNames = "viewCounter" | "mylistCounter" | "likeCounter" | "lengthSeconds" | "commentCounter";
type isoNames = "startTime" | "lastCommentTime";
type tagsAndGenre = "categoryTags" | "tags" | "tagsExact" | "genre" | "genre.keyword";

type fieldsField = Exclude<keyof allField, exactNames>;
type _sortField = countableNames | isoNames;
type filtersField = countableNames | isoNames | tagsAndGenre | "contentId";
type ParticalRecord<T extends string | number | symbol, U> = Partial<Record<T, U>>;
type jsonFilterType = {
    type: 'equal',
    field: filtersField,
    value: allField[fieldsField]
} | {
    type: 'range'
    field: Exclude<filtersField, tagsAndGenre>,
    from: allField[fieldsField],
    to: allField[fieldsField],
    include_lower?: boolean,
    include_upper?: boolean,
} | {
    type: 'or' | 'and',
    filetrs: jsonFilterType[],
} | {
    type: 'not',
    filters: jsonFilterType,
};

export type nicoParam = ({
    q: string,
    targets: readonly targetField[]
} | {
    q: ''
}) & {
    fields?: readonly fieldsField[],
    jsonFilter?: jsonFilterType,
    _sort: `${'+' | '-'}${_sortField}`,
    _offset?: number,
    _limit?: number,
    _context: string,
} & ParticalRecord<`filters[${filtersField}][${number | 'gt' | 'lt' | 'gte' | 'lte'}]`, allField[fieldsField]>;

type nicoResponseSuccess = {
    meta: {
        status: 200,
        id: string,
        totalCount: number,
    },
    data: Pick<allField, fieldsField>[];
};
type nicoResponseError = {
    meta: {
        status: 400 | 500 | 503,
        errorCode: string,
        errorMessage: string,
    }
};
export type nicoResponse = nicoResponseSuccess | nicoResponseError;

export type PlaylistContents = SuccessPlaylistContents | FailedPlaylistContents;

export type KiiteSongData = {
    id: null;
    video_id: string;
    artist_name: string;
    duration: number;
    artist_id: number;
    published_at: string;
    vocaloid_key: string;
    embeddable: true;
    title: string;
    video_thumbnail: string;
};

export type NicoVitaUserData = {
    nicovideo_user_response: {
        user: {
            id: string,
            nickname: string,
            thumbnail_url: string
        },
        vita_option: {
            user_secret: 0
        },
        additionanals: string,
        '@status': 'ok'
    }
} | {
    nicovideo_user_response: {
        error: {
            code: string,
            description: string
        },
        '@status': 'fail'
    }
}
