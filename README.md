# 잼팟 (jampod)

잼팟은 iOS와 안드로이드에서 실행되는 모바일 앱 브라우저입니다. 앱 브라우저란 앱을 설치할 필요없이 바로 실행할 수 있는 앱 브라우징 기술을 탑재한 유틸리티입니다. 앱 브라우저는 웹 브라우저와 비교해서 이해하면 쉬운데, 웹 브라우저에서 웹페이지를 보여주는 것처럼 앱 브라우저에서는 앱을 실행할 수 있다고 이해하시면 됩니다.

잼팟에서 실행가능한 앱을 기존 앱과 구별하기 위해 잼(jam)이라고 부릅니다. 잼은 [잼킷](https://bookjam.github.io/jamkit/)(jamkit)이라는 앱 개발도구로 개발합니다. 잼팟 내에 잼 스토어가 탑재되어 있어 다양한 잼을 설치없이 바로 사용하실 수 있습니다. 잼은 하나의 단일 파일로 구성되어 있기 때문에 잼 스토어를 거치지 않고도 메신저 등을 통해서 전달할 수 있습니다. 잼을 전달받은 디바이스에 잼팟이 설치되어 있다면 바로 잼을 실행할 수 있습니다.

잼팟 역시 [잼킷](https://bookjam.github.io/jamkit/)으로 개발되었습니다. 잼킷을 사용하면 실제 모바일 디바이스가 없더라도 Mac OS 기반의 PC에서 잼팟을 실행할 수 있습니다. 

<img src="https://user-images.githubusercontent.com/19699721/28746636-d5e9c32c-74ca-11e7-9d78-f94d56740f7b.jpg" width="170"> <img src="https://user-images.githubusercontent.com/19699721/28746638-d60f73b0-74ca-11e7-8233-90fb404cc04e.jpg" width="170"> <img src="https://user-images.githubusercontent.com/19699721/28746639-d614ebba-74ca-11e7-9d5c-a6def6e90efd.jpg" width="170"> <img src="https://user-images.githubusercontent.com/19699721/28746640-d61a695a-74ca-11e7-87f8-0b73f39d5e58.jpg" width="170"> <img src="https://user-images.githubusercontent.com/19699721/28746641-d62526d8-74ca-11e7-8eec-c95f13c44a11.jpg" width="170">

## 잼팟을 실행하려면

잼팟을 실행하는 가장 좋은 방법은 앱스토어나 구글플레이에서 공식 배포 버전을 모바일 디바이스에 직접 설치하는 것입니다. 하지만 공식 버전이 배포되기 전이거나 개발 버전을 Mac OS 기반의 PC에서 직접 실행하고 싶은 경우에는 다음 절차대로 따라하시면 됩니다. 개발자라면 매우 쉽게 따라하실 수 있습니다.

### 잼킷 설치하기

우선 [Homebrew](http://brew.sh/index_ko.html)를 이용하여 node.js를 설치합니다.

    brew update
    brew install node

node가 설치되었다면 npm 명령어를 이용하여 잼킷 명령어 도구를 설치합니다.

    sudo npm install -g jamcmd

다음으로 Xcode를 설치하셔야 합니다. Xcode는 [Mac App Store](https://itunes.apple.com/us/app/xcode/id497799835?mt=12)에서 설치하시면 됩니다. Xcode가 설치되었다면 아래 명령을 통해 Xcode 명령어 도구도 설치하세요.

    xcode-select --install

### 잼팟 실행하기

다음 명령어를 통해 잼팟 프로젝트를 다운로드합니다.

    git clone https://github.com/jampod/jampod.git

잼팟 프로젝트 디렉토리에서 잼킷 명령어 도구를 이용하여 실행합니다.

    cd jampod
    jamkit run

Xcode의 시뮬레이터가 실행되면서 잼팟이 그 안에 설치되어 실행되는 모습을 확인하실 수 있습니다.
