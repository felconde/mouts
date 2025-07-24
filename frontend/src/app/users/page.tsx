'use client';

import React from 'react';
import Link from 'next/link';
import { useUsers, useDeleteUser } from '../../hooks/useUsers';
import AuthGuard from '../../components/AuthGuard';

function UsersPageContent() {
  const { data: users, isLoading, error } = useUsers();
  const deleteUser = useDeleteUser();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir o usuário ${name}?`)) {
      try {
        await deleteUser.mutateAsync(id);
        alert('Usuário excluído com sucesso!');
      } catch (error) {
        alert('Erro ao excluir usuário');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">
          Erro ao carregar usuários. Tente novamente.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Usuários</h1>
          <p className="mt-2 text-sm text-gray-700">
            Lista de todos os usuários do sistema.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/users/create"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Novo Usuário
          </Link>
        </div>
      </div>
      <div className="mt-8 overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                Nome
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Email
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Telefone
              </th>
              <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users?.map((user) => (
              <tr key={user.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.phone || '-'}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <Link href={`/users/${user.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-3">Editar</Link>
                  <button onClick={() => handleDelete(user.id, user.name)} className="text-red-600 hover:text-red-900" disabled={deleteUser.isPending}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-sm text-gray-500">
              Nenhum usuário encontrado.
              <Link href="/users/create" className="text-blue-600 hover:text-blue-900 ml-1">Criar o primeiro usuário</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <AuthGuard>
      <UsersPageContent />
    </AuthGuard>
  );
} 