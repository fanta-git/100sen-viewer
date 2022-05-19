import fetch from 'node-fetch';

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
type param = ({
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

type responseSuccess = {
    meta: {
        status: 200,
        id: string,
        totalCount: number,
    },
    data: Pick<allField, fieldsField>[];
};
type responseError = {
    meta: {
        status: 400 | 500 | 503,
        errorCode: string,
        errorMessage: string,
    }
};
type response = responseSuccess | responseError;

type getAPITypes = {
    <T extends param>(url: 'https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search', param: T)
        : Promise<response>;
};

const getAPI: getAPITypes = async (url, param) => {
    const response = await fetch(url + parseParam(param));
    return response.json() as any;
};

const parseParam = (param?: Record<string, any>) => {
    if (param === undefined) return '';
    const ret: [string, string][] = [];
    for (const [key, value] of Object.entries(param)) {
        if (value instanceof Array) {
            ret.push([key, value.join(',')])
        } else if (value instanceof Object) {
            ret.push([key, JSON.stringify(value)]);
        } else {
            ret.push([key, value]);
        }
    }
    return ret.length ? '?' + ret.map(([a, b]) => `${a}=${encodeURIComponent(b)}`).join('&') : '';
}

export default getAPI;
