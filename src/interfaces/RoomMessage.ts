export interface RoomMessage {
  id: string;
  path: string;

  content: string;
  createdAt: number;
  createdBy: {
    id: string;
    name: string;
    image?: string;
  };
}
