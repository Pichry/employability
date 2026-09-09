import axios, { AxiosInstance } from 'axios'
import type { StudentDetail, Queue, WhatIfScenario, User } from '../types'

const API_BASE = (globalThis as any).import?.meta?.env?.VITE_API_URL || 'http://localhost:8000/api'

class EmployabilityClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await this.client.post('/auth/login', { email, password })
    localStorage.setItem('auth_token', res.data.token)
    return res.data
  }

  async logout(): Promise<void> {
    localStorage.removeItem('auth_token')
  }

  async getMyQueue(): Promise<Queue> {
    const res = await this.client.get('/queue/my-queue')
    return res.data
  }

  async getStudentDetail(studentHash: string): Promise<StudentDetail> {
    const res = await this.client.get(`/students/${studentHash}`)
    return res.data
  }

  async runWhatIf(studentHash: string, modifications: Record<string, any>): Promise<WhatIfScenario> {
    const res = await this.client.post(`/students/${studentHash}/whatif`, { modifications })
    return res.data
  }

  async logCaseAction(caseId: number, actionType: string, notes: string): Promise<any> {
    const res = await this.client.post(`/cases/${caseId}/actions`, { actionType, notes })
    return res.data
  }

  async closeCaseNote(caseId: number, body: string, visibility: string): Promise<any> {
    const res = await this.client.post(`/cases/${caseId}/notes`, { body, visibility })
    return res.data
  }
}

export const apiClient = new EmployabilityClient()
