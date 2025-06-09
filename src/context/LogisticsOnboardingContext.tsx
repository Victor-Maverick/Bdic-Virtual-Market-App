'use client'

import { createContext, useContext, useState } from 'react'

interface CompanyInfo {
    companyName: string
    ownerName: string
    companyAddress: string
    taxIdNumber: string
    logo?: File | null
}

interface Documents {
    cacNumber: string
    cacImage?: File | null
    otherDocuments?: File[]
}

interface BankInfo {
    bankName: string
    accountNumber: string
}

interface OnboardingData {
    companyInfo: CompanyInfo
    documents: Documents
    bankInfo: BankInfo
}

interface OnboardingContextType {
    onboardingData: OnboardingData
    updateCompanyInfo: (data: Partial<CompanyInfo>) => void
    updateDocuments: (data: Partial<Documents>) => void
    updateBankInfo: (data: Partial<BankInfo>) => void
    submitOnboarding: (ownerEmail: string) => Promise<void>
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
    const [onboardingData, setOnboardingData] = useState<OnboardingData>({
        companyInfo: {
            companyName: '',
            ownerName: '',
            companyAddress: '',
            taxIdNumber: '',
            logo: null,
        },
        documents: {
            cacNumber: '',
            cacImage: null,
            otherDocuments: [],
        },
        bankInfo: {
            bankName: '',
            accountNumber: '',
        },
    })

    const updateCompanyInfo = (data: Partial<CompanyInfo>) => {
        setOnboardingData(prev => ({
            ...prev,
            companyInfo: { ...prev.companyInfo, ...data },
        }))
    }

    const updateDocuments = (data: Partial<Documents>) => {
        setOnboardingData(prev => ({
            ...prev,
            documents: { ...prev.documents, ...data },
        }))
    }

    const updateBankInfo = (data: Partial<BankInfo>) => {
        setOnboardingData(prev => ({
            ...prev,
            bankInfo: { ...prev.bankInfo, ...data },
        }))
    }

    const submitOnboarding = async (ownerEmail: string) => {
        const formData = new FormData()

        // Add all fields from companyInfo
        formData.append('ownerEmail', ownerEmail)
        formData.append('companyName', onboardingData.companyInfo.companyName)
        formData.append('ownerName', onboardingData.companyInfo.ownerName)
        formData.append('companyAddress', onboardingData.companyInfo.companyAddress)
        formData.append('tin', onboardingData.companyInfo.taxIdNumber)
        if (onboardingData.companyInfo.logo) {
            formData.append('logo', onboardingData.companyInfo.logo)
        }

        // Add documents
        formData.append('cacNumber', onboardingData.documents.cacNumber)
        if (onboardingData.documents.cacImage) {
            formData.append('cacImage', onboardingData.documents.cacImage)
        }
        if (onboardingData.documents.otherDocuments) {
            onboardingData.documents.otherDocuments.forEach((file) => {
                formData.append(`otherDocuments`, file)
            })
        }

        // Add bank info
        formData.append('bankName', onboardingData.bankInfo.bankName)
        formData.append('accountNumber', onboardingData.bankInfo.accountNumber)

        try {
            const response = await fetch('https://api.digitalmarke.bdic.ng/api/logistics/onboardCompany', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to submit onboarding data')
            }

            return await response.json()
        } catch (error) {
            console.error('Error submitting onboarding:', error)
            throw error
        }
    }

    return (
        <OnboardingContext.Provider
            value={{
                onboardingData,
                updateCompanyInfo,
                updateDocuments,
                updateBankInfo,
                submitOnboarding,
            }}
        >
            {children}
        </OnboardingContext.Provider>
    )
}

export function useOnboarding() {
    const context = useContext(OnboardingContext)
    if (context === undefined) {
        throw new Error('useOnboarding must be used within an OnboardingProvider')
    }
    return context
}