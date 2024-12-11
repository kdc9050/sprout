import { axiosInstance } from ".";
import { ChannelItem } from "../api/channel";

export type Author = {
  role: string;
  emailVerified: boolean;
  banned: boolean;
  isOnline: boolean;
  posts: string[];
  likes: string[];
  comments: string[];
  followers: string[];
  following: string[];
  notifications: string[];
  messages: string[];
  _id: string;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type PostItem = {
  likes: string[];
  comments: string[];
  _id: string;
  title: string;
  image?: string;
  imagePublicId?: string;
  channel: ChannelItem;
  author: Author;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Comment = {
  _id: string;
  comment: string;
  author: Author;
  post: string;
  createdAt: string;
  updatedAt: string;
};

export type Like = {
  _id: string;
  user: string;
  post: string;
  createdAt: string;
  updatedAt: string;
};

export const getPostsByChannel = async (channelId: string) => {
  return await axiosInstance.get(`/posts/channel/${channelId}`);
};

export const getPostsByAuthor = async (authorId: string) => {
  return await axiosInstance.get(`/posts/author/${authorId}`);
};

export const getPostById = async (postId: string) => {
  return await axiosInstance.get(`/posts/${postId}`);
};
