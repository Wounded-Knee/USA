'use client'

import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api/users'

const Statistics: React.FC = () => {
    const [users, setUsers] = useState(0)

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(API_URL)
                setUsers(response.data.length)
            } catch (error) {
                console.error('Error fetching users:', error)
            }
        }
        fetchUsers()
    }, [])
    return (
        <section id="statistics" className="py-16 bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-bold mb-4 text-gray-200">Total Users in Database</h3>
                        <p className="text-2xl font-bold text-white">{users}</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Statistics;