import User from "@/models/User";
import mongoose from "mongoose";
import Link from "next/link";
import DeleteUserButton from "@/components/admin/DeleteUserButton";
import dbConnect from '@/lib/mongodb';

import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export const dynamic = 'force-dynamic'; // Prevent static caching

async function getUserPayload() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  if (!token) return null;
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key_change_this_in_production');
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}

async function getUsers(user) {
  await dbConnect();
  
  let query = {};
  if (user && user.role === 'operator') {
    query = { role: 'tenant', university: user.university };
  }
  
  const users = await User.find(query).select('-password').sort({ createdAt: -1 });
  return users;
}

export default async function UsersPage() {
  const user = await getUserPayload();
  if (!user) return <div>Unauthorized</div>;

  const users = await getUsers(user);

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Manajemen Akun</h1>
          <p className="mt-2 text-sm text-gray-700">
            Daftar seluruh pengguna sistem (Developer, Admin, dan Operator) yang terdaftar.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin/users/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
          >
            Tambah Pengguna
          </Link>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="shadow ring-1 ring-black ring-opacity-5 md:rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Nama
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="hidden sm:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Peran (Role)
                    </th>
                    <th scope="col" className="hidden lg:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Region/Kota
                    </th>
                    <th scope="col" className="hidden xl:table-cell px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Terdaftar Pada
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 w-24">
                      <span className="sr-only">Aksi</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user._id.toString()}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 max-w-[150px] truncate">
                        {user.name}
                        {/* Mobile view metadata (Role and Email) */}
                        <div className="sm:hidden mt-1 flex flex-col gap-1">
                          <span className="text-gray-500 text-xs truncate font-normal">{user.email}</span>
                          <div>
                            <span className={`inline-flex rounded-full px-2 text-[10px] font-semibold leading-5 
                              ${user.role === 'developer' ? 'bg-purple-100 text-purple-800' : 
                                user.role === 'admin' ? 'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {user.role}
                            </span>
                            {!user.isStudent && (
                              <span className="inline-flex rounded-full px-2 text-[10px] font-semibold leading-5 bg-orange-100 text-orange-800 ml-1">
                                ROAM
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">{user.email}</td>
                      <td className="hidden sm:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 
                          ${user.role === 'developer' ? 'bg-purple-100 text-purple-800' : 
                            user.role === 'admin' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {user.role}
                        </span>
                        {!user.isStudent && (
                          <span className="inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-orange-100 text-orange-800 ml-1">
                            ROAM
                          </span>
                        )}
                      </td>
                      <td className="hidden lg:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user.city || user.university || '-'}
                      </td>
                      <td className="hidden xl:table-cell whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end gap-3 items-center">
                          <Link href={`/admin/users/${user._id.toString()}/edit`} className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded">
                            Edit
                          </Link>
                          <DeleteUserButton userId={user._id.toString()} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
