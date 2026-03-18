import Image from 'next/image';
import { Mail, Phone } from 'lucide-react';
import { getEmployees } from '@/lib/strapi/data';
import type { ComponentEmployeeCards } from '@/lib/types';

interface EmployeeCardsProps {
  data: ComponentEmployeeCards;
}

export async function EmployeeCards({ data }: EmployeeCardsProps) {
  let employees = await getEmployees(data.workplaceSlug ?? undefined);

  if (data.category) {
    employees = employees.filter((e) => e.category === data.category);
  }

  if (!data.showAll) {
    employees = employees.slice(0, 12);
  }

  if (employees.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {employees.map((employee) => (
        <div key={employee.documentId} className="card p-6 text-center">
          {employee.photo ? (
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
              <Image
                src={employee.photo.url}
                alt={`${employee.firstName} ${employee.lastName}`}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {employee.firstName[0]}{employee.lastName[0]}
              </span>
            </div>
          )}

          <h4 className="font-bold text-primary text-lg">
            {employee.firstName} {employee.lastName}
          </h4>
          {employee.role && (
            <p className="text-sm text-text-muted mb-2">{employee.role}</p>
          )}
          {employee.qualifications && (
            <p className="text-xs text-text-muted mb-3">{employee.qualifications}</p>
          )}

          <div className="space-y-1">
            {employee.phone && (
              <a
                href={`tel:${employee.phone}`}
                className="flex items-center justify-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                {employee.phone}
              </a>
            )}
            {employee.email && (
              <a
                href={`mailto:${employee.email}`}
                className="flex items-center justify-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                {employee.email}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
