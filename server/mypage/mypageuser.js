import { Meteor } from 'meteor/meteor';
import { Study, Comment, Application, Rating } from '/imports/api/collections';

Meteor.methods({
  'users.update'({ name, email, password, phone, techStack, position, address, profilePicture, nickname }) {
    

    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized', '로그인이 필요합니다.');
    }

    // currentUser를 userId를 통해 가져옴
    const currentUser = Meteor.user();
    const existingProfile = currentUser.profile || {};
    const updateData = {};

    // 이메일 중복 체크 (자기 자신을 제외한 다른 사용자들만 체크)
    if (email && email !== currentUser.emails[0].address) {
      const emailExists = Meteor.users.findOne({ 'emails.address': email });
      if (emailExists) {
        console.log('Email already exists', email);  // 이메일 중복 체크 로그
        throw new Meteor.Error('email-already-exists', '이메일이 이미 존재합니다.');
      }
    }

    // 이메일 업데이트
    if (email && email !== currentUser.emails[0].address) {
      updateData['emails.0.address'] = email;
    }
    // 다른 필드 업데이트
    if (name && name !== existingProfile.name) updateData['profile.name'] = name;
    if (phone && phone !== existingProfile.phone) updateData['profile.phone'] = phone;
    if (techStack && techStack.length && JSON.stringify(techStack) !== JSON.stringify(existingProfile.techStack)) {
      updateData['profile.techStack'] = techStack;
    }
    if (position && position !== existingProfile.position) updateData['profile.position'] = position;
    if (address && (address.city !== existingProfile.address.city || address.gubun !== existingProfile.address.gubun)) {
      updateData['profile.address'] = address;
    }
    if (profilePicture !== undefined && profilePicture !== existingProfile.profilePicture) {
      updateData['profile.profilePicture'] = profilePicture;
    }
    if (nickname && nickname !== existingProfile.nickname) {
      updateData['profile.nickname'] = nickname;
    }

    // 비밀번호 업데이트
    if (password) {
      try {
        Accounts.setPassword(userId, password);
      } catch (error) {
        throw new Meteor.Error('password-update-failed', '비밀번호 업데이트 실패');
      }
    }


    // 사용자 정보 업데이트
    try {
      Meteor.users.update(userId, { $set: updateData });
    } catch (updateError) {
      throw new Meteor.Error('update-failed', '사용자 정보 업데이트 실패');
    }

    if (nickname && nickname !== existingProfile.nickname) {
      // Study 컬렉션에서 userId 닉네임 변경
      Study.update(
        { "userId": existingProfile.nickname },
        { $set: { "userId": nickname } },
        (error, result) => {
          if (error) {
            
            throw new Meteor.Error('study-update-failed', 'Study 컬렉션 업데이트 실패');
          }
          
        }
      );

      // Application 컬렉션에서 userIds 배열 내의 닉네임 변경
      Application.update(
        { "userIds": existingProfile.nickname },
        { $set: { "userIds.$": nickname } }, // 배열 내 기존 닉네임을 새로운 닉네임으로 대체
        { multi: true }, // 여러 문서를 업데이트
        (error, result) => {
          if (error) {
            
            throw new Meteor.Error('application-update-failed', 'Application 컬렉션 업데이트 실패');
          }
          
        }
      );

      // Rating 컬렉션에서 ratedUserId 닉네임 변경
      Rating.update(
        { "ratedUserId": existingProfile.nickname },
        { $set: { "ratedUserId": nickname } },
        { multi: true }, // 여러 문서를 업데이트
        (error, result) => {
          if (error) {
            
            throw new Meteor.Error('rating-update-failed', 'Rating 컬렉션(ratedUserId) 업데이트 실패');
          }
          
        }
      );

      // Rating 컬렉션에서 userId 닉네임 변경
      Rating.update(
        { "userId": existingProfile.nickname },
        { $set: { "userId": nickname } },
        { multi: true }, // 여러 문서를 업데이트
        (error, result) => {
          if (error) {
           
            throw new Meteor.Error('rating-update-failed', 'Rating 컬렉션(userId) 업데이트 실패');
          }
          
        }
      );

      // Comment 컬렉션에서 nickname 변경
      Comment.update(
        { "nickname": existingProfile.nickname },  // nickname이 기존 닉네임인 경우
        { $set: { "nickname": nickname } },        // nickname만 새로운 닉네임으로 변경
        { multi: true },                           // 여러 문서를 업데이트
        (error, result) => {
          if (error) {
            
            throw new Meteor.Error('comment-update-failed', 'Comment 컬렉션 업데이트 실패');
          }
          
        }
      );
    }

    return 'User info updated successfully';
  }
});
