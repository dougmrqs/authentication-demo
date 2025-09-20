import db from './db/connection.js';

export type Post = {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePostData = {
  title: string;
  description: string;
  imagePath: string;
  userId: string;
};

class PostRepository {
  async create(postData: CreatePostData): Promise<Post> {
    const [insertedId] = await db('posts').insert(this.postDataToTableRow(postData));
    
    const insertedPost = await db('posts').where({ id: insertedId }).first();
    
    if (!insertedPost) {
      throw new Error('Failed to create post');
    }
    
    return this.tableRowToPost(insertedPost);
  }

  async findAll(): Promise<Post[]> {
    const posts = await db('posts').orderBy('id', 'desc');
    
    return posts.map(post => this.tableRowToPost(post));
  }

  async findById(id: number): Promise<Post | null> {
    const post = await db('posts').where({ id }).first();

    if (!post) {
      return null;
    }

    return this.tableRowToPost(post);
  }

  async findByUserId(userId: string): Promise<Post[]> {
    const posts = await db('posts').where({ user_id: userId }).orderBy('created_at', 'desc');
    
    return posts.map(post => this.tableRowToPost(post));
  }

  private postDataToTableRow(postData: CreatePostData) {
    return {
      title: postData.title,
      description: postData.description,
      image_path: postData.imagePath,
      user_id: postData.userId,
    };
  }

  private tableRowToPost(row: {
    id: number;
    title: string;
    description: string;
    image_path: string;
    user_id: string;
    created_at: Date;
    updated_at: Date;
  }): Post {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      imagePath: row.image_path,
      userId: row.user_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

export const postRepository = new PostRepository();
