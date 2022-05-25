import { v4 as uuidv4 } from 'uuid';
import { Injectable} from "@nestjs/common";
import { AtmType, CreateQueue, CreateAtm } from './interface/atm.interface'

const atms = [
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

const data = {
    atms: atms,
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

setInterval(() => {
    const randomPerson = () => {  
        let text = '';
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let number = "1234";
        let person ={
            name:'',
            transaction:''
        };
        
        for (var i = 0; i < 8; i++){
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        for (var i = 0; i < 1; i++){
            person.transaction = (number.charAt(Math.floor(Math.random() * number.length)));
        }
        person.name = text;
        console.log(person)
        return person;  
    }
    data.queues.push(randomPerson());
    data.transactions(); 
},60000)

@Injectable({})
export class AtmService {

    constructor() {}

    async createAtm(item: CreateAtm){
        const atm = {
            id: uuidv4(), 
            status: 'Free',
            remove: false,
            name: item.name
        }
        data.atms.push(atm);
        return {
            message:'Create successful',
            data:data.atms
        };
    }

    async createQueue(queue: CreateQueue){
        const {name, transaction} = queue
        const newQueue = {
            name: name,
            transaction: transaction
        }
        data.queues.push(newQueue);
        return {
            message:'Create successful',
            data:data.queues
        };
    }

    async deleleAtm(data: any){
        const atm = data.atms.find((matchItem: AtmType) => matchItem.id === data.id)
        console.log(atm)
        console.log(data.atms)
        const waitForAtm = (i:any) => {   
            if(data.atms[i].status !== 'Free'){
                setTimeout(() => {  
                    waitForAtm(i)
                }, 20); 
            }else{
                data.atms.splice(i, 1) 
                return {
                    remove: true  
                }
            }
        }

        for(var i=0; i < data.atms.length; i++){
            if(data.atms[i] === atm){ 
                data.atms[i].remove = true
                waitForAtm(i)
            }
        }
        console.log(data.atms)
    }

    async getAtms(){
        return {
            atms: data.atms
        }
    }

    async getQueues(){
        return {
            queues: data.queues
        }
    }

    async getProcesses(){
        return {
            processedClients: data.processedClients
        }
    }
}