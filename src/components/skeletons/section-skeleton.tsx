// export const SectionSkeleton = ({length =3}:{length?:number}) => {
//     return (
//         <>
//       <div
//         className={cn(
//           "flex items-center justify-between cursor-pointer text-gray-800 text-sm font-medium hover:bg-neutral-300 py-1 px-2 rounded-md transition group",
//           {
//             "bg-neutral-300 duration-500": isOver,
//           }
//         )}
//         ref={setNodeRef}
//         onClick={handleShowClassrooms}
//       >
//         <div className="flex items-center gap-x-1">
//           <ChevronRight
//             className={cn("w-4 h-4 transition", {
//               "rotate-90": showClassrooms,
//             })}
//           />
//           <div className="flex items-center gap-x-2">
//             <EmojiPopover emojiUrl={section.emojiUrl} sectionId={section.id} />
//             <p>{section.name}</p>
//           </div>
//         </div>
//         <div
//           className={cn(
//             "flex items-center gap-x-2 opacity-0 group-hover:opacity-100 transition",
//             {
//               "opacity-100": isDropdownOpen,
//             }
//           )}
//           onClick={(e) => {
//             e.stopPropagation();
//           }}
//         >
//           {!section.isDefault && (
//             <SectionDropdown
//               sectionId={section.id}
//               sectionName={section.name}
//               isDropdownOpen={isDropdownOpen}
//               setIsDropdownOpen={setIsDropdownOpen}
//               sectionType={section.sectionType}
//             />
//           )}
//           <CreateClassDialog sectionId={section.id} />
//         </div>
//       </div>
//         <ClassroomListsWithCreation classrooms={section.classrooms} />
//     </>
//     )
// }
