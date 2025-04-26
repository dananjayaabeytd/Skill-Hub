import api from './api';

const likeService = {
  likePost: async (postId, userId) => {
    return await api.post(`/likes`, null, {
      params: { postId, userId }
    });
  },
  
  unlikePost: async (postId, userId) => {
    return await api.delete(`/likes`, {
      params: { postId, userId }
    });
  },
  
  getLikesCount: async (postId) => {
    const response = await api.get(`/likes/count/${postId}`);
    return response.data;
  },
  
  getUserLike: async (postId, userId) => {
    try {
      const response = await api.get(`/likes/check`, {
        params: { postId, userId }
      });
      return response.data;
    } catch (error) {
      return false;
    }
  }
};

export default likeService;