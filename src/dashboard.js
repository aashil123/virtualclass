/**
 * This class dashBoard is use to  create common behaviours(methods)
 * for following features Document, Video and Presentation Sharing
 * */

var dashBoard = {
  userConfirmation(msg, cb) {
    virtualclass.popup.confirmInput(msg, (confirm) => {
      cb(confirm);
    });
  },

  close() {
    // console.log('Close dashboard');
    const closeButton = document.querySelector('#congdashboard .modal-content button.close');
    if (closeButton != null) {
      closeButton.classList.remove('clicked');
      closeButton.click();
      const navButton = document.querySelector('#dashboardnav button');
      if (navButton != null) {
        navButton.classList.remove('clicked');
      }
      // virtualclass.modal.hideModal();
      // closeButton.classList.remove('clicked');
    }
  },

  isDashBoardExit(app) {
    return (document.querySelector(`#${app}Dashboard`) != null);
  },

  isDashBoardNavExist() {
    return (document.querySelector('#dashboardnav') != null);
  },

  actualCloseHandler() {
    const closeButton = document.querySelector('#congdashboard .modal-content button.close');
    if (closeButton != null) {
      closeButton.addEventListener('click', () => {
        const navButton = document.querySelector('#dashboardnav button');
        if (navButton != null) {
          navButton.classList.remove('clicked');
          const Dtype = 'open';
          dashBoard.dashBoardClickTooltip(Dtype);
        }
      });
    }
  },

  clickCloseButton() {
    const navButton = document.querySelector('#dashboardnav button');
    if (navButton != null) {
      navButton.classList.add('clicked');
    }
  },

  dashBoardClickTooltip(Dtype) {
    const dashBoardButton = document.querySelector('#dashboardnav button');
    if (virtualclass.currApp == 'Video') {
      dashBoardButton.parentNode.setAttribute('data-title', virtualclass.lang.getString(`${Dtype}videoDashboard`));
    } else if (virtualclass.currApp == 'SharePresentation') {
      dashBoardButton.parentNode.setAttribute('data-title', virtualclass.lang.getString(`${Dtype}SharePresentationdbHeading`));
    } else if (virtualclass.currApp == 'DocumentShare') {
      dashBoardButton.parentNode.setAttribute('data-title', virtualclass.lang.getString(`${Dtype}dsDbheading`));
    } else {
      // console.log('dashboard tooltip not working properly');
    }
  },

  dashBoardNavHandler() {
    const app = document.querySelector('.congrea #virtualclassApp');
    if (this.classList.contains('clicked')) {
      virtualclass.dashBoard.close();
      if (app) {
        if (app.classList.contains('dashboard')) {
          app.classList.remove('dashboard');
        }
      }
    } else {
      if (app) {
        if (!app.classList.contains('dashboard')) {
          app.classList.add('dashboard');
        }
      }

      virtualclass.vutil.initDashboard(virtualclass.currApp);
      this.classList.add('clicked');
      const Dtype = 'close';
      virtualclass.dashBoard.dashBoardClickTooltip(Dtype);

      if (virtualclass.currApp === 'DocumentShare' && Object.prototype.hasOwnProperty.call(virtualclass, 'dts')) {
        virtualclass.dts.moveProgressbar();
        if (virtualclass.dts.docs.currNote != null) {
          virtualclass.dts.setCurrentNav(virtualclass.dts.docs.currNote);
        }

        const notes = document.querySelector('.dbContainer #listnotes .linknotes');
        if (notes) {
          const btn = document.querySelector('.congrea.teacher  #dashboardContainer .modal-header button.enable');
          if (!btn) {
            virtualclass.vutil.showFinishBtn();
          }
        } else {
          virtualclass.vutil.removeFinishBtn();
        }
      }
    }
  },
  initDashboardNav(currVideo) {
    if (roles.hasControls()) {
      let dashboardnav = document.querySelector('#dashboardnav button');

      if (dashboardnav == null) {
        const dbNavTemp = virtualclass.getTemplate('dashboardNav');
        const context = { app: virtualclass.currApp };
        const dbNavHtml = dbNavTemp(context);

        const virtualclassAppOptionsCont = document.querySelector('#virtualclassAppOptionsCont');
        virtualclassAppOptionsCont.insertAdjacentHTML('beforeend', dbNavHtml);

        dashboardnav = document.querySelector('#dashboardnav button');
        if (dashboardnav != null) {
          dashboardnav.addEventListener('click', this.dashBoardNavHandler);
          if (currVideo) {
            virtualclass.dashBoard.readyDashboard(currVideo);
          }
        }
      }

      if (virtualclass.currApp === 'DocumentShare') {
        if (!virtualclass.dts.noteExist()) {
          this.readyDashboard();
        } else {
          if (!virtualclass.dts.isUploaderExist()) {
            virtualclass.vutil.modalPopup('docs', ['docsuploadContainer']);
          }
          const dtitle = document.getElementById('dashboardnav');
          dtitle.setAttribute('data-title', virtualclass.lang.getString('DocumentSharedbHeading'));
        }
      } else if (virtualclass.currApp === 'Video') {
        if (typeof currVideo === 'undefined') {
          this.readyDashboard();
        }
        const videoPlaying = document.querySelector('.congrea #listvideo .linkvideo.playing');
        if (!videoPlaying) {
          virtualclass.vutil.removeFinishBtn();
        }
      } else {
        this.readyDashboard();
        console.log('====> dashboard init ');
        const sharing = document.querySelector('.congrea .pptSharing');
        if (sharing) {
          virtualclass.dashBoard.close();
        }
      }
    } else {
      virtualclass.dts.init();
    }
  },

  readyDashboard(currVideo) {
    // console.log('Ready Dashboard');
    const { currApp } = virtualclass;

    if (document.querySelector('#congdashboard') === null) {
      const dashboardTemp = virtualclass.getTemplate('dashboard');
      document.querySelector('#dashboardContainer').innerHTML = dashboardTemp({ app: currApp });;
    }

    this.modalCloseHandler();

    // in any other application we can handle
    // dashoard content in own style
    if (currApp === 'DocumentShare') {
      var dtitle = document.getElementById('dashboardnav');
      dtitle.setAttribute('data-title', virtualclass.lang.getString('DocumentSharedbHeading'));
      if (document.querySelector(`#${currApp}Dashboard`) == null) {
        var elem = document.createElement('div');
        var cont = document.querySelector('#congdashboard .modal-body');
        cont.appendChild(elem);
        elem.id = `${currApp}Dashboard`;
      }
      const docsDbCont = document.querySelector('#docsDbCont');
      if (docsDbCont) {
        docsDbCont.parentNode.removeChild(docsDbCont);
      }

      document.querySelector(`#${currApp}Dashboard`).innerHTML = virtualclass.vutil.getDocsDashBoard(currApp);
      virtualclass.dts.init();
      virtualclass.vutil.attachEventToUploadTab();
      if (!virtualclass.dts.isUploaderExist()) {
        virtualclass.vutil.modalPopup('docs', ['docsuploadContainer']);
      }
      virtualclass.vutil.makeElementActive('#DocumentShareDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
      virtualclass.vutil.makeElementActive('#listnotes');
    } else if (currApp === 'Video') {
      var dtitle = document.getElementById('dashboardnav');
      if (document.querySelector(`#${currApp}Dashboard`) == null) {
        var elem = document.createElement('div');
        var cont = document.querySelector('#congdashboard .modal-body');
        cont.appendChild(elem);
        elem.id = `${currApp}Dashboard`;
      }

      const videocont = document.querySelector('#videoPopup');
      if (!videocont) {
        const videoDashboard = virtualclass.getTemplate('popup', 'videoupload');
        var dbHtml = videoDashboard();
        const videodb = document.querySelector('#VideoDashboard');
        videodb.insertAdjacentHTML('beforeend', dbHtml);
        // $('#VideoDashboard').append(dbHtml);
        const msz = document.querySelector('#videoPopup  #uploadMsz div');
        if (msz) {
          msz.parentNode.removeChild(msz);
        }
        virtualclass.vutil.attachEventToUpload();
        virtualclass.videoUl.UI.inputUrl();
      }
      /* modal need to be created again and old one to be deleted, to remove conflict
       with events of drag drops */
      virtualclass.videoUl.UI.popup(currVideo);
      virtualclass.vutil.makeElementActive('#VideoDashboard .qq-uploader-selector.qq-uploader.qq-gallery');
      virtualclass.vutil.makeElementActive('#listvideo');

      if (currVideo && currVideo.init.videoUrl) {
        var hidepopup = true;
      }

      const dashboardnav = document.querySelector('#dashboardnav button');
      if (dashboardnav != null && !hidepopup && !virtualclass.vutil.isDashboardOpened()) {
        dashboardnav.click();
      }
    } else if (currApp === 'SharePresentation') {
      const dashboardNavgation = document.getElementById('dashboardnav');
      dashboardNavgation.setAttribute('data-title', virtualclass.lang.getString('SharePresentationdbHeading'));
      if (document.querySelector(`#${currApp}Dashboard`) == null) {
        const dashboard = document.createElement('div');
        const congdashboardModal = document.querySelector('#congdashboard .modal-body');
        congdashboardModal.appendChild(dashboard);
        dashboard.id = `${currApp}Dashboard`;
      }
      const dashboardnav = document.querySelector('#dashboardnav button');
      if (dashboardnav != null && !virtualclass.vutil.isDashboardOpened()) {
        dashboardnav.click();
      }
    }
    // in case dashboard already created and button is enabled in previous app
  },

  modalCloseHandler() {
    if (!this.attachModalCloseHandler) {
      const finish = document.querySelector('.congrea .dashboardContainer .modal-header .close');
      if (finish) {
        this.attachModalCloseHandler = true
        console.log('====> modal init handler');
        finish.addEventListener('click', () => {
          const app = document.querySelector('.congrea #virtualclassApp');
          if (app.classList.contains('dashboard')) {
            app.classList.remove('dashboard');
          }
          finish.setAttribute('data-dismiss', 'modal');
          virtualclass.modal.hideModal();
        });
      }
    }
  },
};
