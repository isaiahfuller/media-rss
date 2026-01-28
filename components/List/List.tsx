import Image from 'next/image';
import Link from 'next/link';
import { faBook, faCalendar, faQuestion, faTv, faVideo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Center, Image as MantineImage, Table } from '@mantine/core';
import { GlobalList } from '@/interfaces/globalList';

export default function List({ list }: { list: GlobalList }) {
  function mapFormat(format: string) {
    switch (format) {
      case 'tv':
        return <FontAwesomeIcon icon={faTv} />;
      case 'movie':
        return <FontAwesomeIcon icon={faVideo} />;
      case 'print':
        return <FontAwesomeIcon icon={faBook} />;
      default:
        return <FontAwesomeIcon icon={faQuestion} />;
    }
  }

  return (
    <Table striped withTableBorder>
      <Table.Tbody>
        {list.list.map((item) => (
          <Table.Tr key={item.timestamp}>
            <Table.Td>
              <Link href={item.url || ''}>
                <Center>
                  <MantineImage
                    component={Image}
                    fit="contain"
                    src={item.image}
                    alt={item.title}
                    w="auto"
                    width={100}
                    height={100}
                  />
                </Center>
              </Link>
            </Table.Td>
            <Table.Td>{mapFormat(item.type)}</Table.Td>
            <Table.Td>{item.title}</Table.Td>
            <Table.Td>
              <FontAwesomeIcon icon={faCalendar} />
            </Table.Td>
            <Table.Td>{new Date(item.timestamp).toDateString()}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
