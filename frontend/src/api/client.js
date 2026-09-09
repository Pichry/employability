/**
 * API client for employability system.
 * Connects to backend at http://localhost:8000/api
 */
import axios from 'axios';
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
class EmployabilityClient {
    constructor() {
        Object.defineProperty(this, "client", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.client = axios.create({
            baseURL: API_BASE,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    async login(email, password) {
        const res = await this.client.post('/auth/login', { email, password });
        localStorage.setItem('auth_token', res.data.token);
        return res.data;
    }
    async logout() {
        localStorage.removeItem('auth_token');
    }
    async getMyQueue() {
        const res = await this.client.get('/queue/my-queue');
        return res.data;
    }
    async getStudentDetail(studentHash) {
        const res = await this.client.get(`/students/${studentHash}`);
        return res.data;
    }
    async runWhatIf(studentHash, modifications) {
        const res = await this.client.post(`/students/${studentHash}/whatif`, { modifications });
        return res.data;
    }
    async logCaseAction(caseId, actionType, notes) {
        const res = await this.client.post(`/cases/${caseId}/actions`, { actionType, notes });
        return res.data;
    }
    async closeCaseNote(caseId, body, visibility) {
        const res = await this.client.post(`/cases/${caseId}/notes`, { body, visibility });
        return res.data;
    }
}
export const apiClient = new EmployabilityClient();
