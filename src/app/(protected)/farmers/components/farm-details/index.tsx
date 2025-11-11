"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { FarmDetailsData } from "../../types";

interface FarmDetailsProps {
  data: FarmDetailsData;
}

export const FarmDetails = ({ data }: FarmDetailsProps) => {
  const {
    farmerName,
    location,
    farmId,
    images,
    phoneNumber,
    email,
    farmSize,
    soilType,
    status = "Active",
  } = data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className='w-full'>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle className='text-xl font-semibold'>Farm Details</CardTitle>
          <Badge className={getStatusColor(status)}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-6'>
          {/* First Row - Basic Information */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-600'>
                Farmer Name
              </label>
              <p className='text-base font-semibold text-gray-900'>
                {farmerName}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium text-gray-600'>
                Farm ID
              </label>
              <p className='text-base font-mono text-gray-900'>{farmId}</p>
            </div>
            <div>
              <label className='text-sm font-medium text-gray-600'>
                Location
              </label>
              <p className='text-base text-gray-900'>{location}</p>
            </div>
            {phoneNumber && (
              <div>
                <label className='text-sm font-medium text-gray-600'>
                  Phone Number
                </label>
                <p className='text-base text-gray-900'>{phoneNumber}</p>
              </div>
            )}
          </div>

          {/* Second Row - Additional Details */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {email && (
              <div>
                <label className='text-sm font-medium text-gray-600'>
                  Email
                </label>
                <p className='text-base text-gray-900'>{email}</p>
              </div>
            )}
            {farmSize && (
              <div>
                <label className='text-sm font-medium text-gray-600'>
                  Farm Size
                </label>
                <p className='text-base text-gray-900'>{farmSize}</p>
              </div>
            )}
            {soilType && (
              <div>
                <label className='text-sm font-medium text-gray-600'>
                  Soil Type
                </label>
                <p className='text-base text-gray-900'>{soilType}</p>
              </div>
            )}
            {/* Add empty div if we need to maintain grid structure */}
            {!email && !farmSize && !soilType && <div></div>}
          </div>

          {/* Third Row - Farm Images (Horizontal Scrollable) */}
          <div>
            <label className='text-sm font-medium text-gray-600 mb-3 block'>
              Farm Images
            </label>
            {images && images.length > 0 ? (
              <div className='flex space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                {images.map((image, index) => (
                  <div
                    key={index}
                    className='flex-none w-32 h-32 lg:w-72 lg:h-48 relative rounded-lg overflow-hidden bg-gray-100 border'
                  >
                    <Image
                      src={image}
                      alt={`Farm image ${index + 1}`}
                      fill
                      className='object-cover hover:scale-105 transition-transform duration-200'
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className='w-full h-32 lg:h-40 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center'>
                <div className='text-center'>
                  <div className='w-12 h-12 mx-auto mb-2 text-gray-400'>
                    <svg fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={1.5}
                        d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                  </div>
                  <p className='text-sm text-gray-500'>No images available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
