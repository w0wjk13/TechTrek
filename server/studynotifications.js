// /imports/api/studynotifications.js
import { StudyNotifications } from '/imports/api/collections';  // 파일 경로 수정

Meteor.methods({
  'studyNotifications.create'(studyId, requesterId, creatorId) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인된 유저만 요청할 수 있습니다.');
    }

    const notification = {
      studyId,
      requesterId,
      creatorId,
      status: 'pending',
      requestedAt: new Date(),
      respondedAt: null,
    };

    return StudyNotifications.insert(notification);
  },

  'studyNotifications.updateStatus'(notificationId, status) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', '로그인된 유저만 상태를 변경할 수 있습니다.');
    }

    const validStatuses = ['pending', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      throw new Meteor.Error('invalid-status', '상태는 pending, accepted, rejected만 가능합니다.');
    }

    const notification = StudyNotifications.findOne(notificationId);
    if (!notification) {
      throw new Meteor.Error('notification-not-found', '알림을 찾을 수 없습니다.');
    }

    const updateFields = {
      status,
      respondedAt: (status === 'pending') ? null : new Date(),
    };

    return StudyNotifications.update(notificationId, {
      $set: updateFields,
    });
  },
});
