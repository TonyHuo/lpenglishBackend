import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class ContentListService {
  private db = admin.firestore();

  async createContentList(title: string, description: string, creatorUid: string) {
    const docRef = await this.db.collection('contentLists').add({
      title,
      description,
      creatorUid,
      followers: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  async followContentList(contentListId: string, userUid: string) {
    await this.db.collection('contentLists').doc(contentListId).update({
      followers: admin.firestore.FieldValue.arrayUnion(userUid),
    });
  }

  async unfollowContentList(contentListId: string, userUid: string) {
    await this.db.collection('contentLists').doc(contentListId).update({
      followers: admin.firestore.FieldValue.arrayRemove(userUid),
    });
  }

  async getContentLists() {
    const snapshot = await this.db.collection('contentLists').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}