import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PostsModel } from './entities/posts.entity';
import { InjectRepository } from '@nestjs/typeorm';

export interface PostModel {
  id: number,
  author: string,
  title: string,
  content: string,
  likeCount: number,
  commentCount: number,
}

let posts : PostModel [] =[
  {
    id: 1,
    author: 'newjeans_official',
    title: '뉴진스 민지',
    content: '메이크업 고치는 민지',
    likeCount: 1000000,
    commentCount: 99999,
  },
  {
    id: 2,
    author: 'newjeans_official',
    title: '뉴진스 해린',
    content: '메이크업 고치는 해린',
    likeCount: 1000000,
    commentCount: 99999,
  },
  {
    id: 3,
    author: 'blackpink_official',
    title: '블랙핑크 로제',
    content: '메이크업 고치는 로제',
    likeCount: 1000000,
    commentCount: 99999,
  }
]

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>
  ){}

  async getAllPosts(){
    return this.postsRepository.find();
  }

  async getPostById(id: number){
    const post = await this.postsRepository.findOne({
      where:{
        id,
      }
    });

    if(!post) { throw new NotFoundException();};
  }

  createPost(author: string, title: string, content: string){
    const post = {
      id: posts[posts.length -1].id + 1,
      author,
      title,
      content,
      likeCount : 0,
      commentCount: 0,
    }

    posts = [
      ...posts,
      post,
    ]

    return post;
  }

  updatePost(id: number, author?: string, title?: string, content?: string){
    const post = posts.find(post => post.id === id);
    if(!post) {throw new NotFoundException();}
    if(author) { post.author = author };
    if(title) { post.title = title };
    if(content) { post.content = content };

    posts = posts.map(prevPost => prevPost.id === id ? post : prevPost );

    return post;   
  }

  removePost(id: number){
    const post = posts.find(post => post.id === id);
    if(!post) { throw new NotFoundException();}

    posts = posts.filter(post => post.id !== id);

    return `id: ${id} has removed.`
  }
}
