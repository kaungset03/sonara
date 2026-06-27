import { open } from "@tauri-apps/plugin-dialog";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import useUpdateArtistImageMutation from "@/features/artists/api/useUpdateArtistImageMutation";

type UpdateArtistImageButtonProps = {
  artistId: number;
};

const UpdateArtistImageButton = ({
  artistId,
}: UpdateArtistImageButtonProps) => {
  const mutation = useUpdateArtistImageMutation();

  const handleUpdateCover = async () => {
    const path = await open({
      multiple: false,
      directory: false,
      filters: [
        {
          name: "Image Files (*.jpg, *.jpeg, *.png, *.webp)",
          extensions: ["jpg", "jpeg", "png", "webp"],
        },
      ],
    });
    if (path) {
      mutation.mutate({ artistId, imagePath: path });
    }
  };

  return (
    <Button
      onClick={handleUpdateCover}
      variant="secondary"
      className="absolute bottom-0 right-0 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-350"
    >
      <Upload size={16} />
    </Button>
  );
};
export default UpdateArtistImageButton;
