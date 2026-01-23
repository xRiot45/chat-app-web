export interface Story {
    id: string;
    name: string;
    img: string;
    time: string;
    isViewed?: boolean;
}

export interface StoryViewerProps {
    stories: Story[];
    initialIndex: number;
    onClose: () => void;
}
