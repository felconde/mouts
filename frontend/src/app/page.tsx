'use client';

import React from 'react';
import Link from 'next/link';
import { useIsAuthenticated, useLogout } from '../hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated, user } = useIsAuthenticated();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Sistema de Usuários
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            CRUD completo de usuários com Next.js e NestJS
          </p>

          {isAuthenticated ? (
            <div className="mb-8">
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
                <p className="text-green-800">
                  Bem-vindo, <strong>{user?.name}</strong>!
                </p>
                <p className="text-green-600 text-sm">{user?.email}</p>
              </div>
              
              <div className="space-x-4">
                <Link
                  href="/users"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Gerenciar Usuários
                </Link>
                <button
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  {logout.isPending ? 'Saindo...' : 'Sair'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <div className="space-x-4">
                <Link
                  href="/login"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Criar Conta
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-3">Backend</h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• NestJS + TypeScript</li>
                <li>• PostgreSQL + TypeORM</li>
                <li>• Cache Redis</li>
                <li>• Autenticação JWT</li>
                <li>• Testes Jest</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-semibold mb-3">Frontend</h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Next.js + TypeScript</li>
                <li>• React Query</li>
                <li>• Tailwind CSS</li>
                <li>• Autenticação local</li>
                <li>• Formulários validados</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 