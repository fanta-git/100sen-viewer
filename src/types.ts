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

export type NicoSnapshotv2Response = {}
