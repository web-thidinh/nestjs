import { Injectable} from "@nestjs/common";

@Injectable({})

export class AtmService {

    constructor() {}

    private atms = [
        {
            "id": 'f7b35edf-4da7-4a7d-a37f-edc4ecd85f11',
            'status': 'Free',
            'remove': false,
            'name': 'VCB'
        },{ 
            "id": '1aef91f4-f92b-43b0-b338-f60d1fdb1fdb',
            'status': 'Free', 
            'remove': false,
            'name': 'ACB'
        },{
            "id": '334b841e-cdad-496d-a651-49417b69351d',
            'status': 'Free',
            'remove': false,
            'name': 'AGR' 
        }
    ]

    private data = {
        atms: this.atms,
        queues: [],
        processedClients: '',
        transactions() {
            for ( var i = 0; i < this.atms.length; i++) {
                if (this.atms[i].status === 'Free' && this.atms[i].remove == false && this.queues.length > 0) {
                    this.atms[i].status = 'Busy'
                    this.atms[i].client = this.queues[0].name
                    this.atms[i].transaction = this.queues[0].transaction
                    this.processedClients += `${this.queues[0].name},`
                    this.queues.splice(0, 1)
                } else if (this.atms[i].transaction && this.atms[i].transaction > 0) {
                    this.atms[i].transaction = this.atms[i].transaction - 1
                } else if (this.atms[i].transaction == 0) {
                    this.atms[i].status = 'Free'
                }
            }
        }
    }
    
    async getAtms(){
        return {
            atms: this.data.atms
        }
    }

    async getQueues(){
        return {
            queues: this.data.queues
        }
    }

    async getProcesses(){
        return {
            processedClients: this.data.processedClients
        }
    }
}