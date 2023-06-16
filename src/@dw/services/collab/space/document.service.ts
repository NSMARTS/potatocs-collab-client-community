import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { MeetingListStorageService } from 'src/@dw/store/meeting-list-storage.service';
import { CommonService } from '../../common/common.service';
import { DocDataStorageService } from 'src/@dw/store/doc-data-storage.service';
import { MemberDataStorageService } from 'src/@dw/store/member-data-storage.service';
import { ScrumBoardStorageService } from 'src/@dw/store/scrumBoard-storage.service';
import { AuthService } from '../../auth/auth.service';


@Injectable({
	providedIn: 'root'
})
export class DocumentService {

	constructor(
		private http: HttpClient,
		private meetingListStorageService : MeetingListStorageService,
		private commonService: CommonService,
		private ddsService: DocDataStorageService,
		private mdsService: MemberDataStorageService,
		private scrumService: ScrumBoardStorageService,
		private authService: AuthService
	) { }

	createDoc(docData) {
		console.log("doc서비스",docData)
		return this.http.post('/api/v1/collab/space/doc/create', docData).pipe(
			tap(
			(res:any)=>{
				console.log(res);
				this.scrumService.updateScrumBoard(res.scrumBoard);
			}
			)
		);
	}

	// 문서 삭제
	deleteDoc(docId){	
		return this.http.delete('/api/v1/collab/space/doc/deleteDoc', {params: docId}).pipe(
			tap(
				(res: any) => {
					console.log(res.scrumBoard);
					this.ddsService.updateDocs(res.spaceDocs);
					this.scrumService.updateScrumBoard(res.scrumBoard);
					return res.message;
				}
			)
		);


		
	}

	// doc 에 올려진 파일 목록 가져오기
	getUploadFileList(docId){
		return this.http.get('/api/v1/collab/space/doc/getUploadFileList',{ params: docId });
	}

	// 문서 일정 편집
	editDocDate(data){
		return this.http.post('/api/v1/collab/space/doc/editDoc', data).pipe(
			tap(
				(res: any) => {
					console.log(res.scrumBoard);
					this.ddsService.updateDocs(res.spaceDocs);
					this.scrumService.updateScrumBoard(res.scrumBoard);
					return res.message;
				}
			)
		);
	}

	// 파일 업로드
	fileUpload(filedata, docId, description){
		const formData = new FormData();
		formData.append('file', filedata);
		formData.append('docId', docId);
		formData.append('description', description);
		console.log(formData);
		return this.http.post('/api/v1/collab/space/doc/fileUpload', formData);
	}

	// 업로드된 파일 다운로드
	fileDownload(fileId:any){
		// params를 쓸땐 객체로 보내야한다.
		return this.http.get('/api/v1/collab/space/doc/fileDownload', {params: {fileId: fileId}, responseType: 'blob'});
		// return this.http.get('/api/v1/collab/space/doc/getUploadFileList',{ params: docId });
	}

	//업로드된 파일 삭제
	deleteUploadFile(fileId){
		console.log(fileId);
		console.log(typeof(fileId))
		return this.http.delete('/api/v1/collab/space/doc/deleteUploadFile', {params: fileId});
	}
	
	// 채팅 생성
	createChat(data){
		return this.http.post('/api/v1/collab/space/doc/createChat', data)
	}

	// doc에 있는 채팅들 가져오기
	getChatInDoc(docId){
		console.log(docId);
		return this.http.get('/api/v1/collab/space/doc/getChatInDoc', {params: docId})
	}

	// 채팅 삭제
	deleteChat(data){
		return this.http.delete('/api/v1/collab/space/doc/deleteChat', {params: data})
	}

	// document 편집
	updateDoc(updateDocData) {
		console.log('1');
		return this.http.put('/api/v1/collab/space/doc/update', updateDocData);
	}

	//#park
	//document entry 편집
	updateDocEntry(updateDocEntry) {
		return this.http.put('/api/v1/collab/space/doc/docEntryUpdate', updateDocEntry).pipe(
			shareReplay(1),
			tap(
				async (res: any) => {
					//console.log(res.up);
					// await this.scrumService.updateScrumBoard(res.scrumBoard);
					await this.ddsService.updateDocs(res.updateDocs);

				}
			)
		)
	}
    //#hokyun
    //done 상태 변경
    updateDoneEntry(updateDoneEntry){
        return this.http.put('/api/v1/collab/space/doc/docCheckDone', updateDoneEntry).pipe(
            shareReplay(1),
            tap(
                async (res: any) => {
					// await this.scrumService.updateScrumBoard(res.scrumBoard);
					await this.ddsService.updateDocs(res.updateDocs);

				}
            )
        )
    }
    //#hokyun 2022-08-17
    //doc labels 상태 변경
    updateLabelsEntry(updateLabelsEntry){
        return this.http.put('/api/v1/collab/space/doc/docLabelsUpdate', updateLabelsEntry).pipe(
            shareReplay(1),
            tap(
                async(res: any) => {
                    await this.ddsService.updateDocs(res.updateDocs);

                }
            )
        )
    }

	getInfo(docId) {

		const httpParams = new HttpParams({
			fromObject: {
				docId
			}
		});

		// const paramData = {
		// 	spaceTime
		// }

		return this.http.get('/api/v1/collab/space/doc/getDocInfo', { params: httpParams });
	}

	// 미팅 생성
	createMeeting(data){
		return this.http.post('/api/v1/collab/space/doc/createMeeting', data).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res);
					// this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);

					// commonservice
					for (let index = 0; index < res.meetingList.length; index++) {
                    (res.meetingList[index].start_date = this.commonService.dateFormatting(
                        res.meetingList[index].start_date,
                    )),
                        'dateOnly';
                }
					this.meetingListStorageService.updateMeetingList(res.meetingList);
					return res.message;
				}
			)
		);
	}

	// 미팅목록 가져오기
	getMeetingList(data){
		console.log(data);
		return this.http.get('/api/v1/collab/space/doc/getMeetingList', {params: data}).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res.meetingList);
					// this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);

					// common service
					for (let index = 0; index < res.meetingList.length; index++) {
                    (res.meetingList[index].start_date = this.commonService.dateFormatting(
                        res.meetingList[index].start_date,
                    )),
                        'dateOnly';
                }
					this.meetingListStorageService.updateMeetingList(res.meetingList);
					return res.message;
				}
			)
		);
	}

	// 미팅 삭제
	deleteMeeting(data){
		return this.http.delete('/api/v1/collab/space/doc/deleteMeeting', {params: data}).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res);
					// this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);

					// commonservice
					for (let index = 0; index < res.meetingList.length; index++) {
                    (res.meetingList[index].start_date = this.commonService.dateFormatting(
                        res.meetingList[index].start_date,
                    )),
                        'dateOnly';
                }
					this.meetingListStorageService.updateMeetingList(res.meetingList);
					return res.message;
				}
			)
		);
	}

	// 미팅에 올라온 pdf 삭제
  	deleteMeetingPdfFile(data){
		console.log(data)
		return this.http.delete('https://test-potatocs.com/apim/v1/whiteBoard/deleteMeetingPdfFile', {params: data} );
		// http://localhost:4300/room/61d28a9ab53f13467d3f7991
	}

	// 미팅에서 채팅한 내용 삭제
	deleteAllOfChat(data) {
		console.log(data)
		return this.http.delete('https://test-potatocs.com/apim/v1/collab/deleteAllOfChat.', {params: data} );
		// return this.http.delete('http://localhost:4300/apim/v1/collab/deleteAllOfChat', {params: data} );
	}

	// 호스트가 미팅을 열었을때
	openMeeting(data){
		return this.http.post('/api/v1/collab/space/doc/openMeeting', data).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res);
					// this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);

					// commonservice
					for (let index = 0; index < res.meetingList.length; index++) {
                    (res.meetingList[index].start_date = this.commonService.dateFormatting(
                        res.meetingList[index].start_date,
                    )),
                        'dateOnly';
                }
					this.meetingListStorageService.updateMeetingList(res.meetingList);
					return res.message;
				}
			)
		);
	}

	// 호스트가 미팅을 닫았을때
	closeMeeting(data){
		return this.http.post('/api/v1/collab/space/doc/closeMeeting', data).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res);
					// this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);

					// commonservice
					for (let index = 0; index < res.meetingList.length; index++) {
                    (res.meetingList[index].start_date = this.commonService.dateFormatting(
                        res.meetingList[index].start_date,
                    )),
                        'dateOnly';
                }
					this.meetingListStorageService.updateMeetingList(res.meetingList);
					return res.message;
				}
			)
		);
	}

	// scrumboard  drop event
	scrumEditDocStatus(data){
		return this.http.put('/api/v1/collab/space/doc/scrumEditDocStatus',  data).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res.spaceDocs);
					this.ddsService.updateDocs(res.spaceDocs);
					return res.message;
				}
			)
		);
	}

	// scurmboard dropList event
	scrumEditStatusSequence(data){
		return this.http.put('/api/v1/collab/space/doc/scrumEditStatusSequence',  data);
	}

	// create doc Status
	scrumAddDocStatus(data){
		return this.http.put('/api/v1/collab/space/doc/scrumAddDocStatus', data).pipe(
			shareReplay(1),
			tap(
				async (res: any) => {
					console.log(res.scrumboard);
					await this.scrumService.updateScrumBoard(res.scrumboard);
					return 'fffff';
				}
			)
		);
	}

	// delete doc Status
	scrumDeleteDocStatus(data){
		return this.http.put('/api/v1/collab/space/doc/scrumDeleteDocStatus', data).pipe(
			shareReplay(1),
			tap(
				async (res: any) => {
					console.log(res.scrumboard);
					await this.scrumService.updateScrumBoard(res.scrumboard);
					return res.message;
				}
			)
		);
	}

	statusNameChange(data){
		console.log(data);
		return this.http.put('/api/v1/collab/space/doc/statusNameChange', data)
		.pipe(

			shareReplay(1),
			tap(
				async (res: any) => {
					console.log(res.updateDocs);
					await this.scrumService.updateScrumBoard(res.scrumboard);
                    await this.ddsService.updateDocs(res.updateDocs);
					return res.message;
				}
			)
		)
	}


	//scrum title change
	titleChange(data){
		console.log(data);
		return this.http.put('/api/v1/collab/space/doc/titleChange', data)
		.pipe(

			shareReplay(1),
			tap(
				async (res: any) => {
					
					//await this.scrumService.updateScrumBoard(res.scrumBoard);
                    await this.ddsService.updateDocs(res.updateDocs)
					return res.message;
				}
			)
		)

	}

	// edit doc description
	editDocDescription(data){
		return this.http.post('/api/v1/collab/space/doc/editDocDescription', data);
	}


	// joinMeeting(data){
	// 	return this.http.post('https://localhost:3400/joinMeeting', data);
	// }

	// 파일 업로드
	bgImageUpload(fileData){
		const formData = new FormData();
		formData.append('fileData', fileData);
		// console.log(formData);
		return this.http.post('/api/v1/collab/space/doc/bgImageUpload', formData);
	}



	// CANVAS GSTD 파일 업로드 및 경로 리턴
	uploadBlobToMultipart(url: string, filename: string, blobObj: Blob, appendName: string) {
		const formData = new FormData();
		formData.append(appendName, blobObj, filename);
		// console.log(url);
		const request = new XMLHttpRequest();

		request.open('POST', url);
		request.setRequestHeader('Authorization', 'Bearer ' + this.authService.getToken());

		return new Promise(function (resolve, reject) {
			request.onload = function (e) {
				resolve(request.response);
			};

			request.send(formData);
		});
	}

	// 파일 경로 및 데이터 DB 저장
	sendWhiteBoardRec(docId: string, recordingTitle: string, gstd_key: string, bgImg_key: string, bgImg_location: string) {
		const data = {
			docId,
			recordingTitle,
			gstd_key,
			bgImg_key,
			bgImg_location
		};
		return this.http.post('/api/v1/collab/space/doc/saveRecording', data);
	}

	// Rec Data 불러오기
	getWhiteBoardRecList(docId: string) {
		return this.http.post('/api/v1/collab/space/doc/getWhiteBoardRecList', { docId })
	}

	// 서버에 저장된 GSTD 데이터 불러오기
	// getRecording(gstd_key) {
	// 	return this.http.get('s3://test-potatocs/' + gstd_key);
	// }

	getRecording(gstd_key) {
		console.log(gstd_key);
		return this.http.post('/api/v1/collab/space/doc/getRecording', { gstd_key });
	}

    downloadRecording(recData) {
        return this.http.get('/api/v1/collab/space/doc/downloadRecording', {params: recData, responseType: 'blob'});
    }

	deleteRecording(recData) {
		console.log(recData);
		return this.http.delete('/api/v1/collab/space/doc/deleteRecording', { params: recData });
	}

	// meeting data clicked = true or false
	statusInMeeting(data) {
		return data.map( data => {
            if(data.status == 'pending') {
                data.clicked = false;
				data.isButton = false;
            }else if(data.status == 'Open') {
				data.clicked = true;
				data.isButton = true;
			}else if(data.status == 'Close') {
                data.clicked = false;
				data.isButton = true;
            }
			return data;
        });
	}


}

