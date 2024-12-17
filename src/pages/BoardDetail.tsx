import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import BoardItem from "../components/board/BoardItem";
import Button from "../components/common/Button";
import images from "../constants/images";

import { getPostById, PostItem } from "../api/board";
import { deletePost } from "../api/posting";
import Modal from "../components/common/Modal";
import { useModal } from "../stores/modalStore";
import { useAuthStore } from "../stores/authStore";
import { useTriggerStore } from "../stores/triggerStore";
import BoardItemSkeleton from "../components/common/skeleton/BoardItemSkeleton";

export default function BoardDetail() {
  const { postId, id } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [post, setPost] = useState<PostItem | null>(null);
  const navigate = useNavigate();

  const modalOpen = useModal((state) => state.modalOpen);
  const setModalOpen = useModal((state) => state.setModalOpen);

  const handleDeletePost = () => {
    setModalOpen(true, {
      message: "정말로 포스트를 삭제하시겠습니까?",
      btnText: "삭제",
      btnColor: "main",
      onClick: async () => {
        if (postId) await deletePost({ postId: postId });
        setModalOpen(false);
        navigate(-1);
      },
    });
  };

  const auth = useAuthStore((state) => state.user);
  const setTargetLink = useTriggerStore((state) => state.setTargetLink);
  useEffect(() => {
    const fetchPostData = async () => {
      if (!postId) return;
      try {
        const postData = await getPostById(postId);
        setTargetLink(postData.channel.name);
        setPost(postData);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchPostData();
    return () => {
      setTargetLink(null);
    };
  }, [postId]);

  if (loading || !post)
    return (
      <div className="pb-[30px] flex flex-col relative">
        <div className="h-[100px] px-[30px] sticky top-0 left-0 flex justify-between items-center dark:text-white bg-white dark:bg-black border-b border-whiteDark dark:border-gray z-10">
          <button onClick={() => navigate(-1)} className="">
            <img
              className="dark:invert dark:hover:fill-white"
              src={images.Back}
              alt="back icon"
            />
          </button>
        </div>{" "}
        <BoardItemSkeleton />
      </div>
    );

  return (
    <>
      {modalOpen && <Modal />}
      <div className="pb-[30px] flex flex-col relative">
        <div className="h-[100px] px-[30px] sticky top-0 left-0 flex justify-between items-center dark:text-white bg-white dark:bg-black border-b border-whiteDark dark:border-gray z-10">
          <button onClick={() => navigate(-1)} className="">
            <img
              className="dark:invert dark:hover:fill-white"
              src={images.Back}
              alt="back icon"
            />
          </button>
          <div className="flex items-center gap-5">
            {auth?._id === post?.author._id && (
              <>
                <Button
                  theme="sub"
                  size="sm"
                  text="삭제"
                  onClick={handleDeletePost}
                />
                <Button
                  to={`/board/${id}/${postId}/update?name=${post.channel.name}`}
                  size="sm"
                  text="수정"
                />
              </>
            )}
          </div>
        </div>
        <BoardItem post={post} isDetail={true} channelId={id!} />
      </div>
    </>
  );
}
