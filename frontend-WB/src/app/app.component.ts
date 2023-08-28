import { Component } from '@angular/core';
import { EditData } from './editData.model';
import { Login } from './login.model';
import { PwdManager } from './pwdmanager.model';
import { Model } from './word.model';
import { WordService } from './word.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wordBot';
  workingpage: string = 'home';
  ablwords2: any = [];
  ablwords3: any = [];
  selectedText: any;

  jobData: any = [];
  jobresponse: any = [];
  job = new Model()
  loginCredentials = new Login()
  editmodel = new EditData()
  pwdData = new PwdManager()
  samplejob: any;
  joblength: number = 0;
  wordCount: any = [];
  masterData: any = [];
  logval: any = [];

  indvalue: number = 0;
  indexarray: any = [];

  alertValue: string = '';
  alertMessage: string = '';
  alertTab: string = '';
  alertGesture: string = '';
  actionsButtons: boolean = false;
  deleteName: string = ''
  deleteIndex: any;
  editabl: string = '';
  editsgtn: string = '';
  //empType:string=''

  nextButtonval: boolean = true;
  boxType: string = 'fetch';
  p: number = 1;


  constructor(private wordservice: WordService) {
    //this.wordservice.getAlternateWord();
    this.getJobDesc()
    this.getDetails();
    this.validateLogin();

  }

  wordbot_intro = 'An interactive ableist word collection technique that via user input creates a collection of discardable words.'
  ableist_intro = 'Ableist words are those which seem to be discriminative of and social prejudice against people with disabilities based on the belief that typical abilities are superior.'
  technique_procedure = 'Help us find more of such words by having a quick glance over Job Descriptions from Our ability portal. Your alternate suggestions to these words would enrich our model. Click on Get Started when you are ready!'


  startPage() {
    this.workingpage = 'jdpage'
    this.alertMessage = 'Lets get started!',
      this.alertGesture = 'Great!'
    this.alertValue = 'info'
    this.alertTab = 'show';
    setTimeout(() => {
      this.alertTab = 'fade';
    }, 2000);
  }

  viewDbPage(empType: string) {
    this.viewMasterData()
    if (empType === 'guest') {
      this.actionsButtons = false
      this.workingpage = 'guest'
      this.alertMessage = 'Welcome to Data View page. ',
        this.alertGesture = ''
      this.alertValue = 'info'
      this.alertTab = 'show';
      setTimeout(() => {
        this.alertTab = 'fade';
      }, 2000);
    }
    else if (empType === 'admin') {
      this.logval.forEach((element: any) => {
        if (element[0] === this.loginCredentials.userId && this.loginCredentials.password === element[1]) {
          this.actionsButtons = true
          this.workingpage = 'admin'
          this.alertMessage = 'Welcome to Data View page.',
            this.alertGesture = 'Success!'
          this.alertValue = 'success'
          this.alertTab = 'show';
          setTimeout(() => {
            this.alertTab = 'fade';
          }, 2000);
        }
        else {
          this.workingpage = 'home'
          this.alertMessage = 'Incorrect login credentials',
            this.alertGesture = 'Failed!'
          this.alertValue = 'danger'
          this.alertTab = 'show';
          setTimeout(() => {
            this.alertTab = 'fade';
          }, 2000);
        }
      });

      this.loginCredentials = new Login


    }
    else {
      console.log('emptype', empType)
    }

  }

  homePage() {
    this.workingpage = 'home'
    this.getDetails()
    this.job = new Model()
    this.ablwords2 = []
    this.ablwords3 = []
    this.alertMessage = 'Thank you for your valuable inputs',
      this.alertGesture = 'Great!'
    this.alertValue = 'info'
    this.alertTab = 'show';
    setTimeout(() => {
      this.alertTab = 'fade';
    }, 2000);
  }

  getToPost() {
    this.boxType = 'post';
    this.job = new Model()
    this.ablwords2 = []
    this.ablwords3 = []
  }

  onAddData() {
    if (this.job.ablwords.length !== 0) {
      this.ablwords2 = this.job.ablwords.split(',')
      this.ablwords2.forEach((element: any) => {
        if (this.jobData.Description[this.indvalue].includes(element)) {
          this.alertMessage = 'Words have been selected.',
            this.alertGesture = 'Success!'
          this.alertValue = 'success'
          this.alertTab = 'show';
          setTimeout(() => {
            this.alertTab = 'fade';
          }, 2000);
        } else {
          this.ablwords2 = []
          this.alertMessage = 'Please choose words from the Description',
            this.alertValue = 'danger',
            this.alertGesture = 'Failed!',
            this.alertTab = 'show',
            setTimeout(() => {
              this.alertTab = 'fade';
            }, 2000)
        }
      });

    } else {
      this.ablwords2 = []
      this.alertMessage = 'Please choose words from the Description',
        this.alertValue = 'danger',
        this.alertGesture = 'Failed!',
        this.alertTab = 'show',
        setTimeout(() => {
          this.alertTab = 'fade';
        }, 2000)
    }

    //console.log(this.ablwords2)
  }

  Submit() {
    this.job.abelistWords = this.ablwords2
    console.log(this.ablwords2)
    this.job.alternatewords = this.ablwords3
    this.createJobJson(this.job.abelistWords, this.job.alternatewords);
    this.job = new Model()
    this.ablwords2 = []
    this.ablwords3 = []
    this.sendJobRequest()
  }

  createJobJson(array1: any, array2: any) {
    const mapArrays = (array1: any, array2: any) => {
      const res = [];
      for (let i = 0; i < array1.length; i++) {
        res.push({
          abelistword: array1[i],
          alternateword: array2[i]
        });
      };
      return res;
    };
    this.samplejob = mapArrays(array1, array2);
    this.samplejob = JSON.stringify(this.samplejob)
  }

  deleteWord(index: any) {
    //console.log(index)
    this.ablwords2.splice(index, 1)
    this.ablwords3.splice(index, 1)
  }

  getJobDesc() {
    this.wordservice.getJobDescriptions().subscribe((resp) => {
      if (resp) {
        this.jobresponse = resp
        this.joblength = this.jobresponse.dblen.dblength
        this.jobData = this.jobresponse.data
        this.alertMessage = 'Wordbot has been updated',
          this.alertValue = 'success'
        this.alertGesture = 'Success!'
        this.alertTab = 'show';
        setTimeout(() => {
          this.alertTab = 'fade';
        }, 2000);
        //window.setTimeout()
      } else {
        this.alertMessage = 'Wordbot has failed to update',
          this.alertValue = 'danger',
          this.alertGesture = 'Failed!',
          this.alertTab = 'show',
          setTimeout(() => {
            this.alertTab = 'fade';
          }, 2000)
      }
    })

    this.job = new Model()
    this.ablwords2 = []
    this.ablwords3 = []

  }

  showJobDesc() {
    this.boxType = 'fetch'
    this.indvalue = Math.floor(Math.random() * this.joblength) + 1
    if (this.indvalue) {
      this.alertMessage = 'A new job has been posted.',
        this.alertGesture = 'Success!'
      this.alertValue = 'success'
      this.alertTab = 'show';
      setTimeout(() => {
        this.alertTab = 'fade';
      }, 2000);
    } else {
      this.alertMessage = 'Failed to display job',
        this.alertGesture = 'Failure!'
      this.alertValue = 'danger'
      this.alertTab = 'show';
      setTimeout(() => {
        this.alertTab = 'fade';
      }, 2000);

    }
  }

  sendJobRequest() {
    //console.log('send',typeof(this.samplejob))
    this.wordservice.sendSample(this.samplejob).subscribe((resp) => {
      if (resp) {
        this.alertMessage = 'Data has been recorded',
          this.alertGesture = 'Success!'
        this.alertValue = 'success'
        this.alertTab = 'show';
        setTimeout(() => {
          this.alertTab = 'fade';
        }, 2000);
      } else {
        this.alertMessage = 'Unable to record the data',
          this.alertValue = 'danger',
          this.alertGesture = 'Failed!',
          this.alertTab = 'show',
          setTimeout(() => {
            this.alertTab = 'fade';
          }, 2000)
      }
    })
  }

  getDetails() {
    this.wordservice.getBotDetails().subscribe((resp) => {
      this.wordCount = resp;
    })
  }

  getHighlightedText() {
    this.selectedText = window.getSelection()
    this.selectedText = this.selectedText.toString()
    this.ablwords2.push(this.selectedText)
    //console.log(this.ablwords2)
  }

  viewMasterData() {
    this.wordservice.getViewDbData().subscribe((resp) => {
      this.masterData = resp;
      this.masterData.forEach((element: any) => {
        element[0] = element[0].toLowerCase()
      });
      this.masterData.sort()
      this.alertMessage = 'Master Data has been loaded',
        this.alertGesture = 'Sucess!'
      this.alertValue = 'success'
      this.alertTab = 'show';
      setTimeout(() => {
        this.alertTab = 'fade';
      }, 2000);
    })
  }

  deleteConfirmation(i: number) {
    this.deleteIndex = 20 * (this.p - 1) + i
    this.deleteName = this.masterData[this.deleteIndex][0]

  }

  deleteData() {
    let delJson = [{ "abelistword": this.masterData[this.deleteIndex][0], "alternateword": this.masterData[this.deleteIndex][1] }]
    this.wordservice.deleteData(JSON.stringify(delJson)).subscribe((resp) => {
      if (resp) {
        this.alertMessage = 'Data Deleted Successfully',
          this.alertGesture = 'Sucess!'
        this.alertValue = 'success'
        this.alertTab = 'show';
        setTimeout(() => {
          this.alertTab = 'fade';
        }, 2000);
        this.viewMasterData
        this.masterData = this.masterData.filter((obj: any) => obj[0] !== this.deleteName);
        this.deleteName = '';
        this.deleteIndex = ''
      } else {
        this.alertMessage = 'Unable to delete data',
          this.alertGesture = 'Failed!'
        this.alertValue = 'danger'
        this.alertTab = 'show';
        setTimeout(() => {
          this.alertTab = 'fade';
        }, 2000);
      }

    })
  }

  editRecord(i: number) {
    i = 20 * (this.p - 1) + i
    this.editabl = this.masterData[i][0]
    this.editsgtn = this.masterData[i][1]
    this.editmodel.ablWord = this.masterData[i][0]
    this.editmodel.sugstnWord = this.masterData[i][1]
  }

  saveEdit() {
    let editJson = [{
      "preablw": this.editabl,
      "presgstnw": this.editsgtn,
      "newablw": this.editmodel.ablWord,
      "newsgstnw": this.editmodel.sugstnWord
    }]
    this.wordservice.editData(JSON.stringify(editJson)).subscribe((resp) => {
      if (resp) {
        this.alertMessage = 'Data Edited Successfully',
          this.alertGesture = 'Sucess!'
        this.alertValue = 'success'
        this.alertTab = 'show';
        setTimeout(() => {
          this.alertTab = 'fade';
        }, 2000);
        this.masterData.forEach((element: any) => {
          if (element[0] == this.editabl) {
            element[0] = this.editmodel.ablWord
            element[1] = this.editmodel.sugstnWord
          }
        });
        this.editmodel = new EditData()

      } else {
        this.alertMessage = 'Unable to edit data',
          this.alertGesture = 'Failed!'
        this.alertValue = 'danger'
        this.alertTab = 'show';
        setTimeout(() => {
          this.alertTab = 'fade';
        }, 2000);
      }
    })

  }

  changePwd() {
    let pwdJson = [{ "userid": this.pwdData.userid, "oldpassword": this.pwdData.oldpwd, "newpassword": this.pwdData.newpwd }]
    this.wordservice.changePwd(JSON.stringify(pwdJson)).subscribe((resp) => {
      if (resp) {
        this.alertMessage = 'Password Changed Successfully',
          this.alertGesture = 'Sucess!'
        this.alertValue = 'success'
        this.alertTab = 'show';
        setTimeout(() => {
          this.alertTab = 'fade';
        }, 2000);
        this.pwdData = new PwdManager()

      } else {
        this.alertMessage = 'Unable to Change Password',
          this.alertGesture = 'Failed!'
        this.alertValue = 'danger'
        this.alertTab = 'show';
        setTimeout(() => {
          this.alertTab = 'fade';
        }, 2000);
      }
    })
  }

  validateLogin() {
    this.wordservice.loginValidation().subscribe((resp) => {
      if (resp) {
        this.logval = resp
        this.alertMessage = 'Login Successful',
          this.alertGesture = 'Sucess!'
        this.alertValue = 'success'
        this.alertTab = 'show';
        setTimeout(() => {
          this.alertTab = 'fade';
        }, 2000);
        this.masterData.forEach((element: any) => {
          if (element[0] == this.editabl) {
            element[0] = this.editmodel.ablWord
            element[1] = this.editmodel.sugstnWord
          }
        });
        this.editmodel = new EditData()

      } else {
        this.alertMessage = 'Login Failed',
          this.alertGesture = 'Failed!'
        this.alertValue = 'danger'
        this.alertTab = 'show';
        setTimeout(() => {
          this.alertTab = 'fade';
        }, 2000);
      }
    })
  }



}
