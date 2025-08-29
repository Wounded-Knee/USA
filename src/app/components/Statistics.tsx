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
        <section id="statistics" className="py-16 bg-gradient-to-br from-primary-dark to-primary">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8 text-white">Platform Impact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md border border-white/20">
                        <h3 className="text-xl font-bold mb-4 text-white">Active Voices</h3>
                        <p className="text-3xl font-bold text-white">{users}</p>
                        <p className="text-sm text-white/80 mt-2">Citizens contributing to consensus</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md border border-white/20">
                        <h3 className="text-xl font-bold mb-4 text-white">Testimonies</h3>
                        <p className="text-3xl font-bold text-white">1,247</p>
                        <p className="text-sm text-white/80 mt-2">Sacred records preserved</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md border border-white/20">
                        <h3 className="text-xl font-bold mb-4 text-white">Consensus Reached</h3>
                        <p className="text-3xl font-bold text-white">89</p>
                        <p className="text-sm text-white/80 mt-2">Decisions through unity</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg shadow-md border border-white/20">
                        <h3 className="text-xl font-bold mb-4 text-white">Communities</h3>
                        <p className="text-3xl font-bold text-white">23</p>
                        <p className="text-sm text-white/80 mt-2">Under the tree's shelter</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Statistics;