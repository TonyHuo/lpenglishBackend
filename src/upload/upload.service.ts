import { Injectable, NotFoundException } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class UploadService {
  private sources: Set<string> = new Set();

  async uploadJsonToFirebase(jsonContent: any) {
    const db = admin.firestore();
    
    const docId = jsonContent.id;
    const source = jsonContent.source;
  
    if (!docId) {
      throw new Error('Document ID is required');
    }
  
    if (!source) {
      throw new Error('Source is required');
    }
  
    // 添加 createdAt 字段，使用 Firebase Admin SDK 的 FieldValue.serverTimestamp()
    const updatedJsonContent = {
      ...jsonContent,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
  
    const docRef = db.collection('subtitles').doc(docId);
  
    try {
      await docRef.set(updatedJsonContent);
      console.log(`Document with ID ${docId} successfully uploaded`);
      
      // 添加新的 source 到 Set 中
      this.sources.add(source);
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  async getJsonById(id: string) {
    const db = admin.firestore();
    const docRef = db.collection('subtitles').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    return doc.data();
  }

  async getJsonBySource(source: string) {
    const db = admin.firestore();
    const subtitlesRef = db.collection('subtitles');
    console.log(source);
    try {
      const snapshot = await subtitlesRef.where('source', '==', source).get();
      
      if (snapshot.empty) {
        console.log('No matching documents.');
        return [];
      }  

      const documents = [];
      snapshot.forEach(doc => {
        documents.push({ id: doc.id, ...doc.data() });
      });

      return documents;
    } catch (error) {
      console.error('Error getting documents by source:', error);
      throw error;
    }
  }

  // 新添加的方法：获取所有 sources
  async getAllSources() {
    const db = admin.firestore();
    const subtitlesRef = db.collection('subtitles');
    
    try {
      const snapshot = await subtitlesRef.get();
      const sources = new Set<string>();
      
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.source) {
          sources.add(data.source);
        }
      });
      
      return Array.from(sources);
    } catch (error) {
      console.error('Error getting all sources:', error);
      throw error;
    }
  }
  // get latest videos
  async getLatestVideos() {
    const db = admin.firestore();
    const subtitlesRef = db.collection('subtitles');
  
    try {
      const snapshot = await subtitlesRef
        .orderBy('createdAt', 'desc') // 按创建时间降序排列
        .limit(12) // 最多获取12个文档
        .get();
  
      const videos = [];
      console.log("getlatest")
     
      snapshot.forEach(doc => {
        const data = doc.data();
        console.log(data)
        if (data.source && data.createdAt) {
          videos.push({
            id: doc.id,
            source: data.source,
            duration:data.duration,
            title: data.title || 'Untitled',
            createdAt: data.createdAt.toDate(), // 将 Firestore Timestamp 转换为 JavaScript Date
            // 可以添加其他你需要的字段
          });
        }
      });
  
      return videos;
    } catch (error) {
      console.error('Error getting latest videos:', error);
      throw error;
    }
  }
  // 获取所有 sources images
  async getSourceCollections() {
    const db = admin.firestore();
    const sourceCollectionsRef = db.collection('sourceCollections');

    try {
      const snapshot = await sourceCollectionsRef.get();
      const result = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        
        if (data.name && data.img) {
          result.push({ name:data.name, image: data.img });
        }
      });

      return result;
    } catch (error) {
      console.error('Error getting source collections:', error);
      throw error;
    }
  }
}