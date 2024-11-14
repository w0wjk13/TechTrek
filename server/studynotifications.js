import { Meteor } from "meteor/meteor";
import { StudyNotifications } from "/imports/api/collections"; // StudyNotifications 컬렉션 import

Meteor.methods({
  "studyNotifications.create"(studyId, requesterId, creatorId) {
    // 로그인된 사용자만 알림 생성 가능
    if (!this.userId) {
      throw new Meteor.Error(
        "not-authorized",
        "로그인된 유저만 요청할 수 있습니다."
      );
    }

    // 알림 객체 생성
    const notification = {
      studyId,
      requesterId,
      creatorId,
      status: "pending", // 초기 상태는 대기(pending)
      requestedAt: new Date(),
      respondedAt: null, // 응답 시간이 없으므로 null로 설정
    };

    // 알림 컬렉션에 추가
    return StudyNotifications.insert(notification);
  },

  "studyNotifications.updateStatus"(notificationId, status) {
    // 로그인된 사용자만 알림 상태 업데이트 가능
    if (!this.userId) {
      throw new Meteor.Error(
        "not-authorized",
        "로그인된 유저만 상태를 변경할 수 있습니다."
      );
    }

    // 상태가 "pending", "accepted", "rejected"인지 확인
    const validStatuses = ["pending", "accepted", "rejected"];
    if (!validStatuses.includes(status)) {
      throw new Meteor.Error(
        "invalid-status",
        "상태는 pending, accepted, rejected만 가능합니다."
      );
    }

    // 알림을 찾기
    const notification = StudyNotifications.findOne(notificationId);
    if (!notification) {
      throw new Meteor.Error(
        "notification-not-found",
        "알림을 찾을 수 없습니다."
      );
    }

    // 상태가 수락 또는 거절일 경우에만 respondedAt 시간 추가
    const updateFields = {
      status,
      respondedAt: status === "pending" ? null : new Date(), // "pending"은 응답 시간을 기록하지 않음
    };

    // 알림 상태 업데이트
    return StudyNotifications.update(notificationId, {
      $set: updateFields,
    });
  },
});

// Meteor.startup(() => {
//   // 로그인된 유저를 찾는 로직
//   const user = Meteor.users.findOne({ username: "admin" });

//   if (!user) {
//     console.log("Admin user not found. Please ensure admin is created first.");
//     return;
//   }

//   // 더미 데이터 생성 (studyId는 고정, requesterId와 creatorId는 랜덤하게 설정)
//   const studyId = "study1"; // 예시로 고정된 studyId 사용

//   for (let i = 1; i <= 100; i++) {
//     const requesterId = `user${i}`; // user1, user2, ... user100
//     const creatorId = `user${(i % 100) + 1}`; // creatorId는 다른 user로 설정 (순차적으로 할당)

//     // studyNotifications.create 메서드를 통해 알림 생성
//     // 로그인된 사용자(관리자)를 사용하여 메서드를 호출
//     Meteor.call(
//       "studyNotifications.create",
//       studyId,
//       requesterId,
//       creatorId,
//       { userId: user._id },
//       (error, result) => {
//         if (error) {
//           console.log(`Error creating notification for user${i}:`, error);
//         } else {
//           console.log(`Notification created for user${i}:`, result);
//         }
//       }
//     );
//   }
// });
