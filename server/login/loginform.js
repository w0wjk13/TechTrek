import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

Meteor.methods({
  'users.create'({ name, email, password, phone, techStack, position, address, profilePicture }) {
    // 입력 값 검증
    if (typeof name !== 'string' || name.trim() === '') {
      throw new Meteor.Error('invalid-name', '이름은 필수 입력 항목입니다.');
    }

    // 이메일 유효성 검증 (정규식 사용)
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (typeof email !== 'string' || email.trim() === '' || !emailRegex.test(email)) {
      throw new Meteor.Error('invalid-email', '유효한 이메일을 입력하세요.');
    }

    if (typeof password !== 'string' || password.trim() === '') {
      throw new Meteor.Error('invalid-password', '비밀번호는 필수 입력 항목입니다.');
    }
    if (typeof phone !== 'string' || phone.trim() === '') {
      throw new Meteor.Error('invalid-phone', '전화번호는 필수 입력 항목입니다.');
    }
    if (!Array.isArray(techStack) || techStack.length === 0) {
      throw new Meteor.Error('invalid-tech-stack', '기술 스택은 최소 1개 이상 선택해야 합니다.');
    }
    if (techStack.length > 5) {
      throw new Meteor.Error('tech-stack-limit', '기술 스택은 최대 5개까지 선택할 수 있습니다.');
    }
    if (typeof position !== 'string' || position.trim() === '') {
      throw new Meteor.Error('invalid-position', '포지션은 필수 입력 항목입니다.');
    }
    if (typeof address !== 'string' || address.trim() === '') {
      throw new Meteor.Error('invalid-address', '주소는 필수 입력 항목입니다.');
    }

    // 사용자 생성
    const userId = Accounts.createUser({
      username: email, // 이메일을 username으로 사용
      email,
      password,
      profile: {
        name,
        phone,
        techStack,
        position,
        profilePicture,
        address,
        averageScore: 3, // 초기 평균 점수 설정
      },
      createdAt: new Date(),
    });

    return userId; // 생성된 사용자 ID 반환
  }
});
