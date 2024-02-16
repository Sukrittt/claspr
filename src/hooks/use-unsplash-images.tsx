import axios from "axios";
import { toast } from "sonner";

export type UnsplashImage = {
  id: string;
  alt: string;
  imageUrl: string;
  creatorName: string;
  creatorLink: string;
};

const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export const useUnsplashImages = () => {
  const getUnsplashPhotos = async (query?: string) => {
    try {
      const searchQuery = (query || query?.length === 0) ?? "london";

      if (!UNSPLASH_ACCESS_KEY) {
        throw new Error("Unsplash access key is not defined.");
      }

      const response = await axios(
        `https://api.unsplash.com/search/photos/?query=${searchQuery}&client_id=${UNSPLASH_ACCESS_KEY}&page=1&per_page=32&orientation=landscape`
      );

      const rawImages = response.data.results;

      const images: UnsplashImage[] = rawImages.map((image: any) => {
        return {
          id: image.id,
          alt: image.alt_description,
          imageUrl: image.urls.regular,
          creatorName: image.user.first_name + " " + image.user.last_name,
          creatorLink: image.user.links.html,
        };
      });

      return images;
    } catch (error) {
      toast.error("Unable to connect to Unsplash APIs.");
    }
  };

  //gets a single image from unsplash based on the provided query
  const getSingleUnsplashCoverImage = async (query?: string) => {
    try {
      const searchQuery = (query || query?.length === 0) ?? "random";

      if (!UNSPLASH_ACCESS_KEY) {
        throw new Error("Unsplash access key is not defined.");
      }

      const response = await axios(
        `https://api.unsplash.com/search/photos/?query=${searchQuery}&client_id=${UNSPLASH_ACCESS_KEY}&page=1&per_page=32&orientation=landscape`
      );

      const rawImages = response.data.results;

      const images: UnsplashImage[] = rawImages.map((image: any) => {
        return {
          id: image.id,
          alt: image.alt_description,
          imageUrl: image.urls.regular,
          creatorName: image.user.first_name + " " + image.user.last_name,
          creatorLink: image.user.links.html,
        };
      });

      const randomRange = Math.round(Math.random() * (images.length - 1) + 1);

      //returns a random image from the array of images between 1 and 32.
      return images[randomRange].imageUrl;
    } catch (error) {
      toast.error("Unable to connect to Unsplash APIs.");
    }
  };

  return { getUnsplashPhotos, getSingleUnsplashCoverImage };
};
