import React, { useState } from 'react'
import { Save } from 'lucide-react'
import { EmployeeService } from '@lib/api/index'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@components/ui/dialog'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { Alert, AlertDescription } from '@components/ui/alert'

interface EmployeeFormProps {
  employee?: any
  onClose: () => void
  onSave: (data: any) => Promise<void>
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: employee?.full_name || employee?.username || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    department_id: employee?.department || employee?.department_id || '',
    position_id: employee?.position || employee?.position_id || '',
    date_of_joining: employee?.date_of_joining ? employee.date_of_joining.split('T')[0] : '',
  })

  const [departments, setDepartments] = useState<{ id: number; name: string }[]>([])
  const [positions, setPositions] = useState<{ id: number; title: string }[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  React.useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [depts, pos] = await Promise.all([
          EmployeeService.getDepartments(),
          EmployeeService.getPositions()
        ])
        setDepartments(depts)
        setPositions(pos)
      } catch (err) {
        console.error('Failed to fetch options:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOptions()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.full_name || !formData.email) {
      setError('Please fill in all required fields')
      return
    }

    setIsSaving(true)
    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save employee')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {employee ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
          <DialogDescription>
            {employee ? 'Update employee information' : 'Create a new employee record'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  disabled={isSaving || isLoading}
                  required
                  className="w-full"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  disabled={isSaving || isLoading}
                  required
                  className="w-full"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  disabled={isSaving || isLoading}
                  className="w-full"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department_id?.toString()}
                  onValueChange={(value) => handleSelectChange('department_id', value)}
                  disabled={isSaving || isLoading}
                >
                  <SelectTrigger id="department" className="w-full">
                    <SelectValue placeholder={isLoading ? "Loading..." : "Select department"} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select
                  value={formData.position_id?.toString()}
                  onValueChange={(value) => handleSelectChange('position_id', value)}
                  disabled={isSaving || isLoading}
                >
                  <SelectTrigger id="position" className="w-full">
                    <SelectValue placeholder={isLoading ? "Loading..." : "Select position"} />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.title}>{pos.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date of Joining */}
              <div className="space-y-2">
                <Label htmlFor="date_of_joining">Date of Joining</Label>
                <Input
                  id="date_of_joining"
                  name="date_of_joining"
                  type="date"
                  value={formData.date_of_joining}
                  onChange={handleChange}
                  disabled={isSaving || isLoading}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose} disabled={isSaving} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving || isLoading} className="bg-secondary-900 hover:bg-secondary-800 text-white transition-all duration-200">
              {isSaving ? (
                <>
                  <Save size={16} className="mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Save Employee
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeForm