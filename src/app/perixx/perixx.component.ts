import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ImgPathList } from './ImgPath';
import { KeyBoardManager } from './KeyBoardManager';
import { MacroManager } from './MacroModule';
import { i18nManager } from './i18n';
import { EventManager } from './EventManager';
import { KeyBoardStyle } from './KeyBoardStyle';
import { ThrowStmt } from '@angular/compiler';
import { M_Light_CS } from './M_Light_Perixx';
import { BoxSelectionArea } from './BoxSelectionArea';

@Component({
  selector: 'app-perixx',
  templateUrl: './perixx.component.html',
  styleUrls: ['./perixx.component.css','./NavigationOption.css',
  './Lighting_Option.css','./Home_Option.css',
  './MacroPage.scss','./KeyBoardPage.scss']
})
export class PerixxComponent implements OnInit {
  CRUDCheck = false;
  //["Keyboard_Nav","Macro_Nav","Home_Nav"]
  currentPage = "Home_Nav";
  ImgPath=ImgPathList.getInstance();
  i18nManager=i18nManager.getInstance();
  macroOnEdit=false;
  macroContentInEdit=false;
  KeyBoardManager = new KeyBoardManager(80,3);
  KeyBoardLibray = new KeyBoardManager(80,3);
  MacroManager=new MacroManager();
  operationMenuFlag=false;
  KeyBoardStyle = new KeyBoardStyle();
  M_Light_Perixx= new M_Light_CS(80);
  BoxSelectionArea=new BoxSelectionArea("Macro_Block");

  EM=new EventManager();

  settingsOption=[
    {'name':'Information'
    },
    {'name':'Layout'
    },
    {'name':'Lighting'
    },
    {'name':'Macro'
    },
    {'name':'Auto Sleep'
    },
    {'name':'Bluetooth'
    },
    {'name':'Reset'
    },
  ]
  settingLocation="Information";
  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    //this.MacroManager.getClass().add
  }

  ngAfterViewInit(){
    //this.setPageIndex('SelectDevice');
    //this.setPageIndex('KEYBOARDSETTINGS');
    document.addEventListener('click', (e:any)=>{
       //console.log('%c document_e.target','color:rgb(255,77,255)',  e.target);
        if (e.target.dataset.identity==undefined) {
            this.CRUDCheck = false;
            this.operationMenuFlag=false;
            //this.macroOnEdit= false;
        }
    });

  }
  setPageIndex(pageName = "") {

    if (this.currentPage !=pageName)
    this.currentPage = pageName;

    switch (this.currentPage) {
      case "Home_Nav":

        break;
      case "Keyboard_Nav":

        break;

      case "Lighting_Nav":

        break;
      case "Macro_Nav":
        this.changeDetectorRef.detectChanges();
        var Macro_BlockList = document.querySelectorAll(".Macro_Block");
        this.KeyBoardStyle.applyStyles(Macro_BlockList);
        break;
      default:
        break;
    }

  }


  project_select(event,index){
    console.log("project_select: ", event, index);
    if (this.KeyBoardManager.keyboardOfChoice  != index) {
        this.KeyBoardManager.keyboardOfChoice  = index;
    }
  }
  ExportProfile() {
    this.CRUDCheck = !this.CRUDCheck;
    var typeName = "";
    var defaultName = "";
    switch (this.currentPage) {
      case "LIGHTINGSETTING":
        typeName = "APMode"
        //defaultName=this.M_Light_APMode.getTarget().name;
        break
      case "KEYBOARDSETTINGS":
        typeName = "KeyAssign"
        //defaultName=this.KeyBoardManager.getTarget().projectName;
        break
      case "MACROSETTINGS":
        typeName = "Macro"
        //defaultName=this.MacroManager.getClass().getTarget().name;
        break
      case "AboutPage":
          typeName = "Macro"
          //defaultName=this.MacroManager.getClass().getTarget().name;
          break
      case "ConnectedPage":
        typeName = "Advanced"
        //defaultName=this.LCFM.getClass().projectName;
        break
    }
  }
  getExoprtData(){
    function download(content, fileName, contentType) {
      var a = document.createElement("a");
      var file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    }
    var t_Data=this.MacroManager.getExoprtData();
    if(t_Data){
      download(t_Data, 'json.txt', 'text/plain');
    }
  }

  MacroEditkeyCodeFn(keyCode,index){
    console.log("MacroEditkeyCodeFn=" + keyCode,this.MacroManager.tempMacroContent.Data);
    //event.preventDefault();
    this.MacroManager.tempMacroContent.Data[index].byKeyCode=String(keyCode);
    //this.setDBDataToServer('MacroManager');
}
  macroOperationOption(FNname="") {
    //this.CRUDCheck=!this.CRUDCheck;
    this.operationMenuFlag=false;
    //var typeName="";
    console.log('%c macroOperationOption','color:rgb(255,77,255)',this.operationMenuFlag);

    switch (FNname) {
        case "startRenameMacroFile":
            this.startRenameMacroFile();
            break;
        case "copyFolderFile":
            this.MacroManager.copyFolderFile();
            break;
        case "ExportProfile":
            this.ExportProfile();
            break;
        case "deleteMacroFile":
          this.MacroManager.deleteMacroFile();
            break;
        default:
            alert("macroOperationOption_Error");
            return;
    }




}
macroFileRightClick(i,Event){
  this.MacroManager.getClass().currentChooseMacro=i;
  this.MacroManager.tempMacroContent=this.MacroManager.getClass().getTarget();
  this.operationMenuFlag=true;
  var macroFileOptions = document.getElementById("macroFileOptions") as HTMLDivElement;
  macroFileOptions.style.left = Event.layerX  + "px";
  //Event.clientX  + "px";
  macroFileOptions.style.top = Event.layerY + 80+"px";
  //Event.clientY + "px";
  console.log('%c macroFileRightClick','color:rgb(255,77,255)',  Event);
}
macroFileLeftClick(index){
  this.MacroManager.getClass().currentChooseMacro=index;
  this.MacroManager.tempMacroContent=this.MacroManager.getClass().getTarget();
}
onRecordClick(){
  this.MacroManager.onRecord=true;
  this.MacroManager.allRecordKeys=[];
  this.MacroManager.tempMacroContent=this.MacroManager.getClass().getTarget();
  this.MacroManager.tempMacroContent.resetDefaultData();
  this.MacroManager.addMacroEvent();
}



startRenameMacroFile() {
  this.macroOnEdit = true;
  this.MacroManager.editMacroFileName();
  //var m_list= document.getElementsByClassName('MacroFileName');
  this.changeDetectorRef.detectChanges();
  var m_list = document.querySelectorAll<HTMLElement>('.MacroFileName');
  var target = m_list[this.MacroManager.getClass().currentChooseMacro];
  console.log('%c m_list.target','color:rgb(255,77,255)',  m_list,target);

  if (target != undefined) {
    console.log('%c focus','color:rgb(255,77,255)',  'focus');
    target.focus();
  }
}
renameMacroFile(event) {
  console.log("event=" + event.target.value);
  var regex = event.target.value.replace(/[^\a-\z\A-\Z^0-9\u4E00-\u9FA5]/g, '');
  this.MacroManager.updeteMacroFileName(regex);
  //this.setDBDataToServer('MacroManager');
}

keyboardRMenu(FNname="") {
  this.operationMenuFlag=false;
  console.log('%c keyboardRMenu','color:rgb(255,77,255)',this.operationMenuFlag);
  switch (FNname) {
      case "m_Rename":
        this.KeyBoardLibray.editingName = true;
        this.KeyBoardLibray.updatenameBeingEdited();
        //var m_list= document.getElementsByClassName('MacroFileName');
        this.changeDetectorRef.detectChanges();
        var m_list = document.querySelectorAll<HTMLElement>('.KeyBoardLibrayName');
        var target = m_list[this.KeyBoardLibray.keyboardOfChoice];
        console.log('%c m_list.target','color:rgb(255,77,255)',  m_list,target);
    
        if (target != undefined) {
          console.log('%c focus','color:rgb(255,77,255)',  'focus');
          target.focus();
        }
        break;
      case "m_Copy":
          this.KeyBoardLibray.copyFolderFile();
          break;
      case "m_Export":
          this.ExportProfile();
          break;
      case "m_Delete":
        this.KeyBoardLibray.delete_KeyBoard();
          break;
      default:
          alert("keyboardRMenu_Error");
          return;
  }




}
renameKeyboard(event) {
  console.log("event=" + event.target.value);
  var regex = event.target.value.replace(/[^\a-\z\A-\Z^0-9\u4E00-\u9FA5]/g, '');
  this.KeyBoardLibray.updeteProjectName(regex);
  //this.setDBDataToServer('MacroManager');
}
keyboardLeftClick(index){
  this.KeyBoardLibray.keyboardOfChoice=index;
  this.KeyBoardManager.keyBoardTemp.ImportClassData(this.KeyBoardLibray.getTarget());
}
keyboardRightClick(i,Event){
  this.KeyBoardLibray.keyboardOfChoice=i;
  this.KeyBoardManager.keyBoardTemp.ImportClassData(this.KeyBoardLibray.getTarget());
  this.operationMenuFlag=true;
  var KeyBoardLibrayOptions = document.getElementById("KeyBoardLibrayOptions") as HTMLDivElement;
  KeyBoardLibrayOptions.style.left = Event.layerX  + "px";
  //Event.clientX  + "px";
  KeyBoardLibrayOptions.style.top = Event.layerY + 80+"px";
  //Event.clientY + "px";
  console.log('%c keyboardRightClick','color:rgb(255,77,255)',  Event);
}



}
