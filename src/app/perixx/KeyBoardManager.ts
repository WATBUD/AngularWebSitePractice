import { Injectable } from '@angular/core';
import { KB61Prohibit } from './KeyBoardData';



@Injectable()
export class KeyBoardManager {
    defaultName = "未配置"
    keyboardOfChoice= 0;
    KeyBoardArray = [];
    nameBeingEdited="Test";
    editingName=false;
    maxKayCapNumber: number;
    keyBoardTemp;
    constructor(inputmax=1,quantity=0) {
        this.maxKayCapNumber = inputmax;
        for (let index = 0; index < quantity; index++) {
            this.KeyBoardArray.push(new KeyBoard("硬體配置" + index, inputmax));
        }
        this.keyBoardTemp=new KeyBoard("Template", inputmax);
    }
    hasKeyBoard() {
        if (this.KeyBoardArray.length > 0) {
            return true;
        }
        else {
            return false;
        }

    }
    updatenameBeingEdited(){
        if (this.hasKeyBoard()) {
           this.nameBeingEdited=this.getTarget().projectName;  
        }

    }
    create_KeyBoard(name = "Template") {
        var index = "_"+this.KeyBoardArray.length;
        this.KeyBoardArray.push(new KeyBoard(name + index, this.maxKayCapNumber));
    }
    copyFolderFile(){
        if (this.hasKeyBoard()) {
            var clone =JSON.parse(JSON.stringify(this.getTarget()));
            this.KeyBoardArray.push(clone);
        }
    }
    delete_KeyBoard() {
        if (this.keyboardOfChoice  > 0) {
            var T = this.keyboardOfChoice ;
            this.keyboardOfChoice  -= 1;
            this.KeyBoardArray.splice(T, 1);
        }
        else if (this.keyboardOfChoice  == 0) {
            this.KeyBoardArray.splice(this.keyboardOfChoice , 1);
        }
    }

    updeteProjectName(NewName) {
        if (this.hasKeyBoard()) {
            //var t_name=this.getNotRepeatName(NewName);
            this.getTarget().updeteProjectName(NewName);
            
        }
    }
    keyAssignPrompt(event) {
        var KeyAssignPrompt = document.getElementById("KeyAssignPrompt");
        //KeyAssignPrompt.style.display='block';
        var H = event.target.offsetHeight;
        var W = event.target.offsetWidth;
        KeyAssignPrompt.style.left = event.target.offsetLeft + event.target.offsetWidth + "px";
        KeyAssignPrompt.style.top = event.target.offsetTop + "px";
        console.log('keyAssignPrompt', H, W, event);
        //console.log('keyAssignPrompt', event.offsetX, event.offsetY);

    }

    clearAllKeyboardData(Name) {
        console.log("%c clearAllKeyboardData", "color:red", Name, this.maxKayCapNumber);

        for (let index = 0; index < this.KeyBoardArray.length; index++) {
            this.KeyBoardArray[index] = new KeyBoard(Name + (index + 1), this.maxKayCapNumber);
        }
    }


    setAllProfileFieldData(field, obj) {
        var KBMarr = this.KeyBoardArray
        for (let index = 0; index < KBMarr.length; index++) {
            KBMarr[index][field] = obj;
            //console.log('KBMarr[index][field]', KBMarr[index][field])
        }
    }

    clearAllAssignRecordLed(FindName = "") {
        var KBMarr = this.KeyBoardArray;
        for (let index = 0; index < KBMarr.length; index++) {
            KBMarr[index].clearAssignRecordLed(FindName);
        }
    }


    ChangeAllLookingforMacroName(changeName = "", targetName = "") {
        console.log("EnterKeyChangeMacroName", changeName, targetName);
        var KBMarr = this.KeyBoardArray;
        for (let index = 0; index < KBMarr.length; index++) {
            KBMarr[index].ChangeMacroName(changeName, targetName);
        }
    }

    clearRecordMacroData(targetid = "") {
        console.log("clearRecordMacroData", targetid);
        var KBMarr = this.KeyBoardArray;
        for (let index = 0; index < KBMarr.length; index++) {
            KBMarr[index].clearMacroFile(targetid);
        }
    }
    getTarget() {
        var R_Obj = this.KeyBoardArray[this.keyboardOfChoice ];
        if (R_Obj != undefined) {
            return R_Obj;
        }
        else {
            console.log("%c getTarget_error", this.keyboardOfChoice );
        }
    }

    getAssignTarget(index) {
        return this.KeyBoardArray[index];
    }

}

export class KeyBoard {
    hibernate: any = true;
    winLock: any = false;
    directionSwitch: any = false;
    hibernateTimeArr: any = [1, 3, 5, 10];
    reportRateIndex: any = 0;
    hibernateTime: any = 3;
    defaultName = ""
    projectName: any;
    projectCode=0;
    lightData
    recordAssignBtnIndex: any = 0;
    assignText: any = "設定按鍵:Y";
    maxKayCapNumber;
    assignedKeyboardKeys: any = [[], [], [], []];//61KEY
    assignedFnKeyboardKeys: any = [];//61KEY
    fnModeMartrix: any = [false, false, false];
    fnModeindex: any = 0;
    fiveDefaultLedCode: any = [];
    fiveRecordIndex: any = 0;
    constructor(name = "", inputMax) {
        this.maxKayCapNumber = inputMax;
        this.projectName = name;
        this.projectCode=this.projectName+
        console.log("%c Inpumt_KeyBoard", "color:red", inputMax, this.maxKayCapNumber);

        for (let index = 0; index < 4; index++) {
            for (let i2 = 0; i2 < this.maxKayCapNumber; i2++) {

                this.assignedKeyboardKeys[index].push(
                    this.defaultModule()
                );
            }
        }



        for (let index = 0; index < 5; index++) {
            this.fiveDefaultLedCode.push(
                {
                    projectCode: 0,
                    projectName: this.defaultName
                }
            );
        }
    }
    getHibernateStepTime() {
        //console.log("getHibernateStepTime",this.hibernateTimeArr,this.hibernateTime);
        return this.hibernateTimeArr[this.hibernateTime];
    }
    updeteProjectName(newName=""){
      this.projectName=newName;
    }


    clearLostMacro(MCIarr = []) {
        console.log("clearLostMacro_MCIarr", MCIarr);
        if (MCIarr.length > 0) {
            for (let index = 0; index < this.assignedKeyboardKeys.length; index++) {
                for (let index2 = 0; index2 < this.maxKayCapNumber; index2++) {
                    var target = this.assignedKeyboardKeys[index];
                    if (target[index2].keyAssignType[2] == "KMacro") {
                        if (checkExist(MCIarr, target[index2].macroCode, target[index2].value) == false) {
                            target[index2].keyAssignType[0] = this.defaultName;
                            target[index2].value = "";
                            target[index2].macroOptionNumber = 65536;
                            target[index2].macroCode = 0;
                        }
                    }

                }


            }
        }

        else {
            this.clearAllKMacro();

        }
        function checkExist(array, findTarget1, findTarget2) {
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element.IndexCode == findTarget1 && element.name == findTarget2) {
                    console.log("存在值", element, findTarget1, findTarget2);
                    return true;
                }
            }
            return false;
        }



    }

    clearAllKMacro() {
        for (let index = 0; index < this.assignedKeyboardKeys.length; index++) {

            for (let index2 = 0; index2 < this.maxKayCapNumber; index2++) {

                var target = this.assignedKeyboardKeys[index];
                if (target[index2].keyAssignType[2] == "KMacro") {
                    target[index2].keyAssignType[2] = this.defaultName;
                    target[index2].value = this.defaultName;
                    target[index2].macroOptionNumber = 65536;
                    target[index2].macroCode = 0;
                }
            }
        }
    }

    ChangeLCFMName(changeName = "", targetName = "") {
        var V3 = this.fiveDefaultLedCode;
        console.log("ChangeLCFMName", changeName, targetName, this.assignedKeyboardKeys);

        for (let index = 0; index < this.assignedKeyboardKeys.length; index++) {

            for (let index2 = 0; index2 < this.maxKayCapNumber; index2++) {
                var target = this.assignedKeyboardKeys[index];
                if (target[index2].projectName == targetName) {
                    //V1Fn[index].projectCode=0;
                    target[index2].projectName = changeName;
                }
            }
        }
        for (let index = 0; index < V3.length; index++) {
            if (V3[index].projectName == targetName) {
                //V3[index].projectCode=0;
                V3[index].projectName = changeName;
            }
        }
    }

    ChangeMacroName(changeName = "", targetName = "") {
        console.log("KeyChangeMacroName", changeName, targetName);
        for (let index = 0; index < this.assignedKeyboardKeys.length; index++) {
            var target = this.assignedKeyboardKeys[index];
            for (let index2 = 0; index2 < this.maxKayCapNumber; index2++) {
                let T = target[index2];
                if (T.value == targetName && T.keyAssignType[0] == "KMacro") {
                    console.log("KeyChangeMacroName_t", T);
                    T.value = changeName;
                }
            }
        }
    }
    clearMacroFile(targetid = "") {
        for (let index = 0; index < this.assignedKeyboardKeys.length; index++) {
            var target = this.assignedKeyboardKeys[index];
            for (let index2 = 0; index2 < this.maxKayCapNumber; index2++) {
                let T = target[index2];
                if (T.macroCode == targetid && T.keyAssignType[2] == "KMacro") {
                    T.keyAssignType[2] = "";
                    T.macroCode = 0;
                    T.value = "";
                }

            }
        }
    }

    countTotalAssign() {
        var V2Normal = this.assignedKeyboardKeys[0];
        var count = 0;
        for (let index = 0; index < this.maxKayCapNumber; index++) {
            if (V2Normal[index].projectCode != 0) {
                count += 1;
            }
        }

        return count;


    }
    clearAssignRecordLed(FindName = "") {
        var V3 = this.fiveDefaultLedCode;
        for (let index = 0; index < this.assignedKeyboardKeys.length; index++) {
            var target = this.assignedKeyboardKeys[index];
            for (let index2 = 0; index2 < this.maxKayCapNumber; index2++) {
                if (target[index2].projectName == FindName) {
                    target[index2].projectCode = 0;
                    target[index2].projectName = "";
                }
            }
        }
        for (let index = 0; index < V3.length; index++) {
            if (V3[index].projectName == FindName) {
                V3[index].projectCode = 0;
                V3[index].projectName = "";
            }
        }

    }
    clearAssignLedcode(FindCode = "") {
        var V3 = this.fiveDefaultLedCode;
        for (let index = 0; index < this.assignedKeyboardKeys.length; index++) {
            var target = this.assignedKeyboardKeys[index];

            for (let index2 = 0; index2 < this.maxKayCapNumber; index2++) {
                if (target[index2].projectCode == FindCode) {
                    target[index2].projectCode = 0;
                    target[index2].projectName = this.defaultName;
                }
            }

        }
        for (let index = 0; index < V3.length; index++) {
            if (V3[index].projectCode == FindCode) {
                V3[index].projectCode = 0;
                V3[index].projectName = this.defaultName;
            }
        }

    }

    ImportClassData(InputData) {
        console.log("ImportClassData", InputData);
        var arr = Object.keys(this);
        console.log("Object.keys", arr);
        for (let index = 0; index < arr.length; index++) {
            if (arr[index] != "KB61Prohibit") {
                this[arr[index]] = InputData[arr[index]];
            }
        }
    }
    HasSet(checkIndex = 0) {
        var target = this.getNowModeKeyMatrix();
        var N = target[checkIndex].value;
        var N2 = target[checkIndex].projectName;
        var N3 = target[checkIndex].LongTimePressValue;
        var N4 = target[checkIndex].InstantPressValue;
        return (N != "" || N2 != "" || N3 != "" || N4 != "") ? true : false;
    }




    getKeyTargetOptionFrequency() {

        var N = this.getNowModeTargetMatrixKey().macroOptionNumber;
        console.log("getKeyTargetOptionFrequency", N);

        switch (true) {
            case (N < 65535):
                return N;
            case (N == 65535):
                return 1;
            case (N == 65536):
                return 1;
        }
    }




    getNowModeKeyMatrix() {
        return this.assignedKeyboardKeys[this.fnModeindex];
    }
    getNowModeTargetMatrixKey() {
        var target = this.getNowModeKeyMatrix()[this.recordAssignBtnIndex]
        if (target != undefined) {
            return target;
        }
        else {
            console.log("%c getNowModeTargetMatrixKey_lost", "color:red", this, this.getNowModeKeyMatrix(), this.recordAssignBtnIndex);
        }
    }

    switchLongTime_Instant_Status() {
        this.getNowModeTargetMatrixKey().LongTime_Instant_Status = !this.getNowModeTargetMatrixKey().LongTime_Instant_Status;
    }

    setFnModeMartrix(targetIndex) {
        this.fnModeMartrix[targetIndex] = !this.fnModeMartrix[targetIndex];
        for (let index = 0; index < this.fnModeMartrix.length; index++) {
            if (targetIndex != index) {
                this.fnModeMartrix[index] = false;
            }
        }

        if (!this.fnModeMartrix.some((element) => element == true)) {
            this.fnModeindex = 0;
        }
        else {
            this.fnModeindex = targetIndex + 1;
        }
        console.log("setFnModeMartrix_改後", this.fnModeMartrix[targetIndex], this.fnModeindex);

    }


    set_prohibit(Class = "") {
        var target = KB61Prohibit.get_prohibit(Class);
        console.log("get_prohibit", target);
        for (let index = 0; index < target.length; index++) {
            var T = this.getNowModeKeyMatrix()[target[index]];
            for (let KATindex = 0; KATindex < 3; KATindex++) {
                T.keyAssignType[KATindex] = "K12";
            }
            T.value = "⊘";
            T.LongTimePressValue = "⊘";
            T.InstantPressValue = "⊘";
            T.macroOptionNumber = 65536;
        }
    }
    cancel_prohibit() {
        console.log("cancel_prohibit_FNMode");
        let T = this.getNowModeKeyMatrix();
        for (let index = 0; index < T.length; index++) {
            for (let KATindex = 0; KATindex < 3; KATindex++) {
                if (T[index].keyAssignType[KATindex] == "K12") {
                    T[index].keyAssignType[KATindex] = this.defaultName;
                    T[index].LongTimePressValue = this.defaultName;
                    T[index].InstantPressValue = this.defaultName;
                    T[index].value = this.defaultName;
                    T[index].macroOptionNumber = 65536;
                    T[index].macroCode = 0;
                }
            }

        }

    }
    //"設定按鍵:"
    get_assign_promptText(Type) {
        switch (Type) {
            case 'LongTimePressValue':
                return this.getNowModeTargetMatrixKey().LongTimePressValue;
            case 'InstantPressValue':
                return this.getNowModeTargetMatrixKey().InstantPressValue;
            case 'NormalKeyPress':
                return this.getNowModeTargetMatrixKey().value;
        }
    }
    //"燈光設置:"
    get_Led_promptText() {
        //console.log("FNMode_get_Led_promptText");
        return this.getNowModeTargetMatrixKey().projectName;
    }
    checkFnSetOnlyData(inputValue) {
        console.log("clearLostMacro_MCIarr");
        var V1 = this.getNowModeKeyMatrix();
        for (let index = 0; index < this.maxKayCapNumber; index++) {
            for (let KATindex = 0; KATindex < 3; KATindex++) {
                if (V1[index].keyAssignType[KATindex] == inputValue) {
                    V1[index] = this.defaultModule();
                }
            }
        }
    }
    set_assign_Text_Value(type_Code = "", inputValue, OptionNumber = 65536, IndexCode = 0) {

        console.log("set_assign_Text_ValueTypeName", type_Code);
        console.log("set_assign_Text_ValueIndexCode", IndexCode);
        console.log("FNMode_TextAndValue");
        var T = this.getNowModeTargetMatrixKey();
        T.macroOptionNumber = OptionNumber;
        T.macroCode = IndexCode;
        switch (this.getNowModeTargetKeyPressStatus()) {
            case 'LongTimePress':
                T.keyAssignType[0] = type_Code;
                T.LongTimePressValue = inputValue;
                break;
            case 'InstantPress':
                T.keyAssignType[1] = type_Code;
                T.InstantPressValue = inputValue;
                break;
            case 'NormalPress':
                T.keyAssignType[2] = type_Code;
                T.value = inputValue;
                break;
        }
    }

    getNowModeTargetKeyPressStatus() {
        if (this.getNowModeTargetMatrixKey().openLongTimePress) {
            if (this.getNowModeTargetMatrixKey().LongTime_Instant_Status) {
                return 'LongTimePress';
            }
            else {
                return 'InstantPress';
            }
        }
        else {
            return 'NormalPress';
        }
    }
    setRecordLed(projectName, projectCode) {
        console.log("setRecordLedVar_", projectName, projectCode);
        var T = this.getNowModeTargetMatrixKey();
        T.projectName = projectName;
        T.projectCode = projectCode;

    }





    set_FiveLed(projectName, projectCode) {
        console.log("set_FiveLed", projectName, projectCode);
        var T = this.fiveDefaultLedCode[this.fiveRecordIndex];
        T.projectCode = projectCode;
        T.projectName = projectName;
    }





    resetAssignFive(index) {
        var T = this.fiveDefaultLedCode[index];
        T.projectCode = 0;
        T.projectName = this.defaultName;
    }

    reset_assign_default(type = "") {
        console.log("reset_assign_default", type);
        if (type == "key") {
            var T = this.getNowModeTargetMatrixKey();
            T.keyAssignType[2] = this.defaultName;
            T.value = this.defaultName;
            T.macroOptionNumber = 65536;
            T.macroCode = 0;
        }
        else if (type == "led") {
            var T = this.getNowModeTargetMatrixKey();
            T.projectName = this.defaultName;
            T.projectCode = 0;
        }
        else if (type == "LongTime_or_Instant_Delete") {
            var T = this.getNowModeTargetMatrixKey();
            if (T.LongTime_Instant_Status) {
                T.keyAssignType[0] = this.defaultName;
                T.LongTimePressValue = "";
            }
            else {
                T.keyAssignType[1] = this.defaultName;
                T.InstantPressValue = "";
            }
        }

    }

    defaultModule(type = "") {
        var T = {
            macro_RepeatType: 0,
            macro_Data: {},
            assignValue: '',
            defaultValue: 'Default',
            profileName: '',
            recordBindCodeType: '',
            recordBindCodeName: this.defaultName,
            shortcutsWindowsEnable: false,
            ApplicationPath: "",
            WebsitePath: "",
            combinationkeyEnable: false,
            Shift: false,
            Alt: false,
            Ctrl: false,
            hasFNStatus: false,
            Windows: false,
            changed: false,
        }
        return T;
    }
}












