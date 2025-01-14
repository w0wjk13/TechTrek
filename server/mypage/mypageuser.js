import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  // 사용자 정보 수정 메소드
  'users.update'({ name, email, password, phone, techStack, position, address, profilePicture, nickname }) {
    // 데이터 검증 (check와 Match 대신 사용)
    if (typeof name !== 'string') {
      throw new Meteor.Error('invalid-argument', 'name must be a string');
    }
    if (typeof email !== 'string') {
      throw new Meteor.Error('invalid-argument', 'email must be a string');
    }
    if (typeof password !== 'string') {
      throw new Meteor.Error('invalid-argument', 'password must be a string');
    }
    if (typeof phone !== 'string') {
      throw new Meteor.Error('invalid-argument', 'phone must be a string');
    }
    if (!Array.isArray(techStack)) {
      throw new Meteor.Error('invalid-argument', 'techStack must be an array');
    }
    if (typeof position !== 'string') {
      throw new Meteor.Error('invalid-argument', 'position must be a string');
    }
    if (typeof address !== 'object' || !address.city || !address.gubun) {
      throw new Meteor.Error('invalid-argument', 'address must be a string');
    }
    if (profilePicture !== undefined && typeof profilePicture !== 'string') {
      throw new Meteor.Error('invalid-argument', 'profilePicture must be a string or undefined');
    }
    if (typeof nickname !== 'string') {
      throw new Meteor.Error('invalid-argument', 'nickname must be a string');
    }

    // 현재 로그인된 사용자 정보 가져오기
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error('not-authorized', '로그인이 필요합니다.');
    }
    const currentUser = Meteor.user();

    let emailChanged = false;
    if (email !== currentUser.emails[0].address) {
      // 이메일이 변경된 경우, 해당 이메일이 다른 사용자에게 존재하는지 확인
      const existingUserWithEmail = Meteor.users.findOne({ 'emails.address': email });
      if (existingUserWithEmail) {
        throw new Meteor.Error('email-exists', '이 이메일은 이미 사용 중입니다.');
      }
      emailChanged = true;
    }
    const existingUserWithNickname = Meteor.users.findOne({ 'profile.nickname': nickname });

  
    // 닉네임 중복 확인
    if (existingUserWithNickname && existingUserWithNickname._id !== userId) {
      throw new Meteor.Error('nickname-exists', '이 닉네임은 이미 사용 중입니다.');
    }
    // 사용자 정보 업데이트를 위한 데이터 준비
    const updateData = {
        'profile.name': name,
        'profile.phone': phone,
        'profile.techStack': techStack,
        'profile.position': position,
        'profile.address': address,
        'profile.profilePicture': profilePicture,
        'profile.nickname': nickname,
    };

    if (emailChanged) {
      updateData['emails.0.address'] = email; // 이메일 주소 업데이트
    }


    let passwordChanged = false;
    if (password) {
      Accounts.setPassword(userId, password); // 비밀번호 변경
      passwordChanged = true;
    }

  
    // 프로필 사진 업데이트 (파일 URL로 처리)
    if (profilePicture) {
      updateData['profile.profilePicture'] = profilePicture;
    }

    // 사용자 프로필 정보 업데이트
    Meteor.users.update(userId, { $set: updateData });

    return 'User info updated successfully';
  }
});
