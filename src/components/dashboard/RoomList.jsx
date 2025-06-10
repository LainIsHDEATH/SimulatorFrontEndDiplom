import { Button } from "../ui/button";

export default function RoomList({ rooms, selectedRoom, onSelect }) {
    return (
        <div className="flex gap-2 mb-4">
            {rooms.map(room => (
                <Button
                    key={room.id}
                    variant={selectedRoom?.id === room.id ? "default" : "outline"}
                    onClick={() => onSelect(room)}
                >
                    {room.name}
                </Button>
            ))}
        </div>
    );
}